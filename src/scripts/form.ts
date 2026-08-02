/**
 * Contact form submission.
 *
 * An enhancement, not a requirement: the form has a real `action` and
 * `method`, so with scripting off it posts normally and Web3Forms renders its
 * own confirmation. This upgrades that to an inline result without a page
 * change, and turns a failed request into a mailto: fallback rather than a
 * lost message.
 */

interface FormCopy {
  submitting: string;
  submit: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
  emailFallback: string;
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  // Guard against double-binding: astro:page-load fires on every navigation,
  // and view transitions can leave the previous listener attached.
  if (form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  const result = form.querySelector<HTMLElement>('[data-result]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const fallbackEmail = form.dataset.fallbackEmail ?? '';

  /**
   * Copy comes from the markup, which the dictionary rendered. Nothing
   * user-facing is written in this file — that is what keeps the form
   * translatable along with the rest of the site.
   */
  const text: FormCopy = {
    submitting: form.dataset.copySubmitting ?? '',
    submit: form.dataset.copySubmit ?? submit?.textContent?.trim() ?? '',
    successTitle: form.dataset.copySuccessTitle ?? '',
    successBody: form.dataset.copySuccessBody ?? '',
    errorTitle: form.dataset.copyErrorTitle ?? '',
    errorBody: form.dataset.copyErrorBody ?? '',
    emailFallback: form.dataset.copyEmailFallback ?? '',
  };

  /** Built with DOM APIs rather than innerHTML — no string is ever parsed as
      markup, so the result panel cannot become an injection point. */
  const show = (state: 'success' | 'error', title: string, body: string, link?: HTMLAnchorElement) => {
    if (!result) return;

    result.dataset.state = state;
    result.hidden = false;
    result.replaceChildren();

    const heading = document.createElement('strong');
    heading.textContent = title;
    result.append(heading, document.createTextNode(body));

    if (link) result.append(document.createTextNode(' '), link);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = new FormData(form);

    if (submit) {
      submit.disabled = true;
      submit.textContent = text.submitting;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error(`Web3Forms responded ${response.status}`);

      show('success', text.successTitle, text.successBody);
      form.reset();

      // The form has served its purpose; leaving an active button invites a
      // duplicate submission.
      if (submit) submit.remove();
      return;
    } catch {
      let link: HTMLAnchorElement | undefined;

      if (fallbackEmail) {
        link = document.createElement('a');
        link.href = `mailto:${fallbackEmail}`;
        link.textContent = `${text.emailFallback}: ${fallbackEmail}`;
      }

      show('error', text.errorTitle, text.errorBody, link);
    }

    if (submit) {
      submit.disabled = false;
      submit.textContent = text.submit;
    }
  });
}
