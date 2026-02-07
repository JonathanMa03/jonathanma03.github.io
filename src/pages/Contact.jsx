function Contact() {
    return (
      <>
        <h1>My Links and Socials</h1>
        <p>You can reach me at:</p>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2rem' }}>
          <li>
            📧 Email:{' '}
            <a href="mailto:jonathanma217@outlook.com" style={{ color: '#cbd6f6' }}>
              jonathanma217@outlook.com
            </a>
          </li>
          <li>
            🧑🏽‍💼 LinkedIn:{' '}
            <a
              href="https://www.linkedin.com/in/jonathanma217/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd6f6' }}
            >
              linkedin.com/in/jonathanma217
            </a>
          </li>
          <li>
            💻 GitHub:{' '}
            <a
              href="https://github.com/JonathanMa03"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd6f6' }}
            >
              github.com/JonathanMa03
            </a>
          </li>
          <li>
            ORCID:{' '}
            <a
              href="https://orcid.org/0009-0005-1185-3281"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd6f6' }}
            >
              orcid.org/0009-0005-1185-3281
            </a>
          </li>
        </ul>
      </>
    );
  }
  
  export default Contact;