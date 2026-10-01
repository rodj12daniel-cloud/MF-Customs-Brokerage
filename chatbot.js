(() => {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="mfc-chatbot" data-mfc-chatbot>
      <section class="mfc-chatbot__panel" id="mfc-chat-panel" data-chat-panel aria-label="MF Customs Assistant" aria-hidden="true" hidden>
        <header class="mfc-chatbot__header">
          <h2 class="mfc-chatbot__title">MF Customs Assistant</h2>
          <button class="mfc-chatbot__close" type="button" data-chat-close aria-label="Close chat">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </header>
        <div class="mfc-chatbot__messages" data-chat-messages role="log" aria-live="polite" aria-relevant="additions text" tabindex="-1">
          <p class="mfc-chatbot__message mfc-chatbot__message--assistant">Hi! How can we help you today?</p>
        </div>
        <div class="mfc-chatbot__suggestions" data-chat-suggestions aria-label="Suggested questions"></div>
        <form class="mfc-chatbot__composer" data-chat-form>
          <label class="mfc-chatbot__sr-only" for="mfc-chat-input">Your message</label>
          <input class="mfc-chatbot__input" id="mfc-chat-input" data-chat-input type="text" maxlength="500" placeholder="Type or choose a question..." autocomplete="off" required>
          <button class="mfc-chatbot__send" type="submit" aria-label="Send message">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
          </button>
        </form>
      </section>
      <button class="mfc-chatbot__launcher" type="button" data-chat-open aria-label="Open MF Customs Assistant" aria-controls="mfc-chat-panel" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H9l-5 3v-14zM8 10h8M8 13h5"/></svg>
      </button>
    </div>
  `);

  const widget = document.querySelector('[data-mfc-chatbot]');
  if (!widget) return;

  const launcher = widget.querySelector('[data-chat-open]');
  const panel = widget.querySelector('[data-chat-panel]');
  const closeButton = widget.querySelector('[data-chat-close]');
  const form = widget.querySelector('[data-chat-form]');
  const input = widget.querySelector('[data-chat-input]');
  const messages = widget.querySelector('[data-chat-messages]');
  const suggestions = widget.querySelector('[data-chat-suggestions]');

  const suggestedQuestions = [
    'What services do you offer?',
    'What does customs clearance include?',
    'Do you provide freight forwarding?',
    'What does tariff consultancy cover?',
    'What commodities do you handle?',
    'Who are the founding partners?',
    'How can I contact MF Customs Brokerage?',
  ];

  const topics = [
    {
      terms: ['freight forwarding', 'air freight', 'sea freight', 'freight'],
      answer: 'The website lists air and sea freight forwarding, for domestic and international shipments.',
      href: 'services.html',
      link: 'View services',
    },
    {
      terms: ['customs clearance', 'import clearance', 'export clearance', 'fcl', 'lcl', 'break bulk', 'warehousing'],
      answer: 'Import and export customs clearance includes FCL and LCL, formal and informal shipments, bulk and break bulk cargo, and warehousing.',
      href: 'services.html',
      link: 'View services',
    },
    {
      terms: ['customs and tariff consultancy', 'tariff classification', 'incoterms', 'rules of origin', 'duties and taxes', 'tariff', 'consultancy'],
      answer: 'Customs and tariff consultancy covers tariff classification, computation of duties and taxes, Incoterms inquiries, customs and tariff laws, and rules of origin.',
      href: 'services.html',
      link: 'View services',
    },
    {
      terms: ['trucking service', 'trucking', 'truck'],
      answer: 'Trucking services are listed on the Services page. Contact MF Customs Brokerage to discuss your requirements.',
      href: 'contact.html',
      link: 'Contact MF Customs Brokerage',
    },
    {
      terms: ['import license', 'license accreditation', 'import accreditation'],
      answer: 'Import license accreditation is listed among the services. Contact MF Customs Brokerage for details.',
      href: 'contact.html',
      link: 'Contact MF Customs Brokerage',
    },
    {
      terms: ['lifting of abandonment', 'abandonment'],
      answer: 'Lifting of abandonment is listed among the services. Contact MF Customs Brokerage for details.',
      href: 'contact.html',
      link: 'Contact MF Customs Brokerage',
    },
    {
      terms: ['tentative release', 'customs protest', 'protest filing'],
      answer: 'The Services page lists filing of tentative release and Customs Protest.',
      href: 'services.html',
      link: 'View services',
    },
    {
      terms: ['commodities', 'commodity', 'goods handled', 'products handled'],
      answer: 'The team page lists feeds and premixes, appliances and spare parts, wafers, food grade products, animal feeds, vaccines, polyethylene, machine parts, steel products, cocoa, construction materials, cooking oil, and spaghetti.',
      href: 'team.html',
      link: 'Meet the team',
    },
    {
      terms: ['accreditations', 'accredited', 'bureau of customs', 'department of trade', 'pccb'],
      answer: 'The homepage displays the Bureau of Customs, Department of Trade and Industry, and Philippine Chamber of Customs Brokers accreditations.',
      href: 'index.html#about',
      link: 'View the homepage',
    },
    {
      terms: ['john halili', 'john mcron', 'franz rogacion', 'franz virgel', 'founders', 'founding partners', 'team', 'customs broker'],
      answer: 'MF Customs Brokerage was formed by licensed customs brokers John Mcron D. Halili and Franz Virgel C. Rogacion. Both graduated from Adamson University. Their profiles are on the Our Team page.',
      href: 'team.html',
      link: 'Meet the team',
    },
    {
      terms: ['mission', 'vision'],
      answer: 'The mission is to make international trade easier through customs brokerage and logistics services tailored to clients. The vision is to be recognized as a capable and efficient customs brokerage company and build lasting client relationships.',
      href: 'index.html#about',
      link: 'Read more about MF Customs Brokerage',
    },
    {
      terms: ['about', 'company', 'our story', 'partnership', 'shared ambition'],
      answer: 'MF Customs Brokerage began when two young customs brokers with a shared passion for the industry formed a partnership to grow together and work toward a shared ambition.',
      href: 'index.html#about',
      link: 'About MF Customs Brokerage',
    },
    {
      terms: ['services', 'service', 'what do you offer', 'what do you do', 'what can you help with', 'what do you handle'],
      answer: 'The listed services are import and export customs clearance, freight forwarding, customs and tariff consultancy, trucking, import license accreditation, lifting of abandonment, and tentative release and Customs Protest filing.',
      href: 'services.html',
      link: 'View services',
    },
    {
      terms: ['contact', 'email', 'phone', 'telephone', 'address', 'location', 'located', 'office', 'quote', 'get in touch', 'reach you'],
      answer: 'Contact details listed on the website:\nEmail: sales@mfcustomsbrokerage.com or import@mfcustomsbrokerage.com\nPhone: +63 945 110 1410, +63 995 123 9785, or +63 999 813 9198\nAddress: 420 Area B Gate 12 Parola, Tondo, Manila.',
      href: 'contact.html',
      link: 'Open the Contact page',
    },
  ];

  const fallback = {
    answer: "I couldn't find that information on the website. Please contact MF Customs Brokerage and the team can help.",
    href: 'contact.html',
    link: 'Contact MF Customs Brokerage',
  };

  function findAnswer(question) {
    const normalized = question.toLowerCase().replace(/[^a-z0-9@+.-]+/g, ' ').replace(/\s+/g, ' ').trim();
    const unsupportedDetails = /\b(price|prices|pricing|cost|costs|fee|fees|rate|rates|how much|how long|turnaround|hours|schedule|policy|policies)\b/.test(normalized);
    if (unsupportedDetails) return fallback;

    return topics.find((topic) => topic.terms.some((term) => normalized.includes(term))) || fallback;
  }

  function createMessage(text, sender, href, linkText) {
    const message = document.createElement('p');
    message.className = `mfc-chatbot__message mfc-chatbot__message--${sender}`;
    message.textContent = text;

    if (href && linkText) {
      message.append(document.createElement('br'));
      const link = document.createElement('a');
      link.href = href;
      link.textContent = linkText;
      message.append(link);
    }

    return message;
  }

  function updateSuggestions() {
    const terms = input.value.toLowerCase().trim().split(/\s+/).filter((term) => term.length > 1);
    const matches = terms.length
      ? suggestedQuestions.filter((question) => {
        const normalized = question.toLowerCase();
        return terms.every((term) => normalized.includes(term));
      })
      : suggestedQuestions;

    suggestions.replaceChildren();
    suggestions.hidden = panel.hidden || matches.length === 0;

    matches.forEach((question) => {
      const button = document.createElement('button');
      button.className = 'mfc-chatbot__suggestion';
      button.type = 'button';
      button.textContent = question;
      button.addEventListener('click', () => sendQuestion(question));
      suggestions.append(button);
    });
  }

  function showTypingIndicator() {
    const indicator = document.createElement('p');
    indicator.className = 'mfc-chatbot__message mfc-chatbot__message--assistant mfc-chatbot__typing';
    indicator.setAttribute('aria-label', 'MF Customs Assistant is typing');

    const accessibleText = document.createElement('span');
    accessibleText.className = 'mfc-chatbot__sr-only';
    accessibleText.textContent = 'MF Customs Assistant is typing';
    indicator.append(accessibleText);

    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement('span');
      dot.className = 'mfc-chatbot__typing-dot';
      dot.setAttribute('aria-hidden', 'true');
      indicator.append(dot);
    }

    messages.append(indicator);
    messages.scrollTop = messages.scrollHeight;
    return indicator;
  }

  function sendQuestion(question, focusInput = false) {
    const cleanedQuestion = question.trim();
    if (!cleanedQuestion) return;

    messages.append(createMessage(cleanedQuestion, 'user'));
    input.value = '';
    suggestions.hidden = true;
    const indicator = showTypingIndicator();
    messages.scrollTop = messages.scrollHeight;

    window.setTimeout(() => {
      const reply = findAnswer(cleanedQuestion);
      indicator.replaceWith(createMessage(reply.answer, 'assistant', reply.href, reply.link));
      messages.scrollTop = messages.scrollHeight;
    }, 3500);

    if (focusInput) input.focus();
    else messages.focus({ preventScroll: true });
  }

  let closeTimer;

  function setOpen(isOpen) {
    window.clearTimeout(closeTimer);
    launcher.setAttribute('aria-expanded', String(isOpen));
    launcher.setAttribute('aria-label', isOpen ? 'Close MF Customs Assistant' : 'Open MF Customs Assistant');

    if (isOpen) {
      panel.hidden = false;
      panel.classList.remove('is-closing');
      panel.setAttribute('aria-hidden', 'false');
      updateSuggestions();
      suggestions.querySelector('button')?.focus();
      return;
    }

    panel.setAttribute('aria-hidden', 'true');
    suggestions.hidden = true;
    panel.classList.add('is-closing');
    launcher.focus();
    closeTimer = window.setTimeout(() => {
      panel.hidden = true;
      panel.classList.remove('is-closing');
    }, 180);
  }

  launcher.addEventListener('click', () => setOpen(launcher.getAttribute('aria-expanded') !== 'true'));
  closeButton.addEventListener('click', () => setOpen(false));
  input.addEventListener('input', updateSuggestions);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && launcher.getAttribute('aria-expanded') === 'true') setOpen(false);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (question) sendQuestion(question, true);
  });
})();