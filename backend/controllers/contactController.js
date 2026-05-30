const ContactMessage = require('../models/ContactMessage');

const FORMSUBMIT_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || 'supportzaikarecipes@gmail.com';

const sendToFormSubmit = async ({ name, email, mobile, subject, message }) => {
  const url = `https://formsubmit.co/ajax/${encodeURIComponent(FORMSUBMIT_EMAIL)}`;

  // FormSubmit is most compatible with form-encoded bodies; include _replyto for reply address
  const params = new URLSearchParams();
  params.append('name', name);
  params.append('email', email);
  params.append('_replyto', email);
  params.append('mobile', mobile);
  params.append('_subject', subject || 'New contact message from Zaika Recipes');
  params.append('message', message);
  params.append('_captcha', 'false');
  params.append('_template', 'table');

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });
  } catch (err) {
    throw new Error('Network error when contacting FormSubmit: ' + err.message);
  }

  const text = await res.text().catch(() => '');
  let parsed = {};
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    parsed = { text };
  }

  return { status: res.status, ok: res.ok, body: parsed };
};

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res) => {
  try {
    const { name, email, mobile, subject, message, skipFormSubmit, formsubmitStatus: clientFormStatus, formsubmitResponse: clientFormResponse } = req.body;

    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ message: 'Name, email, mobile number, and message are required.' });
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      subject: (subject || '').trim(),
      message: message.trim(),
      source: 'contact-page',
      formsubmitStatus: clientFormStatus || 'pending',
      formsubmitResponse: clientFormResponse || {},
    });

    // If the frontend already sent to FormSubmit, skip server-side forwarding
    if (!skipFormSubmit) {
      try {
        const result = await sendToFormSubmit({
          name: contactMessage.name,
          email: contactMessage.email,
          mobile: contactMessage.mobile,
          subject: contactMessage.subject,
          message: contactMessage.message
        });
        contactMessage.formsubmitStatus = result.ok ? 'sent' : 'failed';
        contactMessage.formsubmitResponse = result;
        await contactMessage.save();
        if (!result.ok) console.error('FormSubmit returned non-2xx:', result);
      } catch (mailError) {
        console.error('FormSubmit delivery failed:', mailError.message);
        contactMessage.formsubmitStatus = 'failed';
        contactMessage.formsubmitResponse = { error: mailError.message };
        await contactMessage.save();
      }
    }

    res.status(201).json({
      message: 'Contact message saved successfully.',
      mailSent: contactMessage.formsubmitStatus === 'sent',
      data: contactMessage,
    });
  } catch (error) {
    console.error('Create contact message error:', error);
    res.status(500).json({ message: 'Failed to submit contact form.' });
  }
};

// @desc    Get contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ message: 'Failed to load contact messages.' });
  }
};

module.exports = { createContactMessage, getContactMessages };