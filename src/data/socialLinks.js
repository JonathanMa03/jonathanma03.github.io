import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaOrcid } from 'react-icons/fa';
import { FaRedditAlien, FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
  {
    name: 'Email',
    value: 'jonathanma217@outlook.com',
    url: 'mailto:jonathanma217@outlook.com',
    icon: FiMail,
    contactOrder: 1,
  },
  {
    name: 'LinkedIn',
    value: 'linkedin.com/in/jonathanma217',
    url: 'https://www.linkedin.com/in/jonathanma217/',
    icon: FiLinkedin,
    contactOrder: 2,
    railOrder: 2,
  },
  {
    name: 'GitHub',
    value: 'github.com/JonathanMa03',
    url: 'https://github.com/JonathanMa03',
    icon: FiGithub,
    contactOrder: 3,
    railOrder: 1,
  },
  {
    name: 'ORCID',
    value: 'orcid.org/0009-0005-1185-3281',
    url: 'https://orcid.org/0009-0005-1185-3281',
    icon: FaOrcid,
    contactOrder: 4,
  },
  {
    name: 'Instagram',
    value: '@jonmapiano',
    url: 'https://www.instagram.com/jonmapiano/',
    icon: FaInstagram,
    contactOrder: 5,
  },
  {
    name: 'Facebook',
    value: 'jonmapiano',
    url: 'https://www.facebook.com/jonmapiano',
    icon: FaFacebook,
    contactOrder: 6,
  },
  {
    name: 'Reddit',
    value: 'u/Fall0fReach-jOnYx-NA',
    url: 'https://www.reddit.com/user/Fall0fReach-jOnYx-NA/',
    icon: FaRedditAlien,
    contactOrder: 7,
    railOrder: 3,
  },
  {
    name: 'X',
    value: '@jaune_miniMAx',
    url: 'https://x.com/jaune_miniMAx',
    icon: FaXTwitter,
    contactOrder: 8,
    railOrder: 4,
  },
];

export default socialLinks;
