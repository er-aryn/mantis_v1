const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { readState, updateState } = require('./api/lib/store');
const { createSession, handleUserAnswer } = require('./api/lib/assistant');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static(uploadDir));
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/companies', (_req, res) => {
  const state = readState();
  res.json(state.companies);
});

app.post('/api/companies', (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const company = {
    id: uuidv4(),
    name,
    description: description || '',
    createdAt: new Date().toISOString()
  };

  updateState((state) => {
    state.companies.push(company);
    return state;
  });

  return res.status(201).json(company);
});

app.get('/api/products', (req, res) => {
  const state = readState();
  const q = String(req.query.q || '').toLowerCase().trim();
  const result = !q
    ? state.products
    : state.products.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)
      );
    });

  const withCompany = result.map((product) => ({
    ...product,
    company: state.companies.find((company) => company.id === product.companyId) || null,
    resourceCount: state.resources.filter((resource) => resource.productId === product.id).length
  }));

  res.json(withCompany);
});

app.post('/api/products', (req, res) => {
  const { companyId, name, category, description, imageUrl } = req.body;

  if (!companyId || !name || !category) {
    return res.status(400).json({ error: 'companyId, name, and category are required' });
  }

  const state = readState();
  const company = state.companies.find((item) => item.id === companyId);
  if (!company) {
    return res.status(404).json({ error: 'company not found' });
  }

  const product = {
    id: uuidv4(),
    companyId,
    name,
    category,
    description: description || '',
    imageUrl: imageUrl || '',
    createdAt: new Date().toISOString()
  };

  updateState((next) => {
    next.products.push(product);
    return next;
  });

  return res.status(201).json(product);
});

app.get('/api/products/:id', (req, res) => {
  const state = readState();
  const product = state.products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'product not found' });
  }

  const company = state.companies.find((item) => item.id === product.companyId) || null;
  const resources = state.resources.filter((item) => item.productId === product.id);

  return res.json({
    ...product,
    company,
    resources
  });
});

app.post('/api/products/:id/resources', upload.single('file'), (req, res) => {
  const state = readState();
  const product = state.products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'product not found' });
  }

  const { title, type, externalUrl } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: 'title and type are required' });
  }

  if (!req.file && !externalUrl) {
    return res.status(400).json({ error: 'file or externalUrl is required' });
  }

  const resource = {
    id: uuidv4(),
    productId: product.id,
    title,
    type,
    filePath: req.file ? `/uploads/${req.file.filename}` : '',
    externalUrl: externalUrl || '',
    createdAt: new Date().toISOString()
  };

  updateState((next) => {
    next.resources.push(resource);
    return next;
  });

  return res.status(201).json(resource);
});

app.post('/api/products/:id/issues', (req, res) => {
  const { issueText, userName } = req.body;
  if (!issueText) {
    return res.status(400).json({ error: 'issueText is required' });
  }

  const state = readState();
  const product = state.products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'product not found' });
  }

  const issue = {
    id: uuidv4(),
    productId: product.id,
    userName: userName || 'Anonymous User',
    issueText,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  const session = createSession({
    issueId: issue.id,
    product,
    issueText
  });

  updateState((next) => {
    next.issues.push(issue);
    next.sessions.push(session);
    return next;
  });

  const firstQuestion = (session.playbook.questions || [])[0];

  return res.status(201).json({
    issue,
    sessionId: session.id,
    assistant: firstQuestion
      ? {
          type: 'question',
          question: firstQuestion.prompt,
          hint: firstQuestion.hint || ''
        }
      : {
          type: 'diagnosis',
          status: 'resolved',
          topCauses: [],
          recommendedActions: []
        }
  });
});

app.post('/api/assistant/:sessionId/message', (req, res) => {
  const { answerText } = req.body;
  if (!answerText) {
    return res.status(400).json({ error: 'answerText is required' });
  }

  const state = readState();
  const session = state.sessions.find((item) => item.id === req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'session not found' });
  }

  const assistantReply = handleUserAnswer(session, answerText);

  updateState((next) => {
    const idx = next.sessions.findIndex((item) => item.id === session.id);
    next.sessions[idx] = session;

    const issue = next.issues.find((item) => item.id === session.issueId);
    if (issue && assistantReply.type === 'diagnosis') {
      issue.status = 'resolved';
      issue.resolution = assistantReply;
      issue.resolvedAt = new Date().toISOString();
    }

    return next;
  });

  return res.json({ sessionId: session.id, assistant: assistantReply });
});

app.get('/api/assistant/:sessionId', (req, res) => {
  const state = readState();
  const session = state.sessions.find((item) => item.id === req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'session not found' });
  }
  return res.json(session);
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mantis app running on http://localhost:${PORT}`);
});
