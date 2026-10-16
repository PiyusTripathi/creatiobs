# SEO Launch Checklist

Use this before final delivery and again after the live domain is connected.

- Pages are indexable: every important page has `meta name="robots" content="index, follow"` or no blocking robots tag.
- Sitemap works: open `https://creatiobs.com/sitemap.xml` after deployment and confirm all course and journal URLs return 200.
- Robots works: open `https://creatiobs.com/robots.txt` and confirm it points to the sitemap.
- Canonicals are correct: replace `https://creatiobs.com/` if the final domain is different.
- HTTPS is enabled in GitHub Pages or the production host.
- Google Search Console: add the live domain, verify with DNS or an HTML/meta verification token, then submit `/sitemap.xml`.
- Google Analytics or equivalent: add the real measurement ID in the site analytics snippet before launch.
- Admission form: connect `#demoForm` to a real backend or form service before relying on lead delivery.
- Tracking events: test admission form submit, WhatsApp clicks and call clicks in analytics debug mode.
- Local SEO: replace placeholder address, hours and Google Maps link with verified academy details.
- Images: replace placeholders with approved student/project/classroom images and descriptive `alt` text.
- Redirects: add host-level redirects if old URLs or extensionless URLs are used in campaigns.
