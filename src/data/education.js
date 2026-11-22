const education = [
  {
    level: 'Undergraduate',
    institution: 'Rutgers University',
    degree: 'B.S. Finance, B.A. Economics, Minor in Statistics',
    mentorship: [
      {
        label: 'Economics',
        segments: [
          { type: 'text', value: 'I am grateful for ' },
          {
            type: 'link',
            label: 'Dr. Tetsuji Yamada',
            href: 'https://economics.camden.rutgers.edu/faculty/tetsuji-yamada/',
          },
          { type: 'text', value: ' and ' },
          {
            type: 'link',
            label: 'Dr. I-Ming Chiu',
            href: 'https://economics.camden.rutgers.edu/faculty/i-ming-chiu/',
          },
          {
            type: 'text',
            value: ' for introducing me to empirical economic research.',
          },
        ],
      },
      {
        label: 'Finance',
        segments: [
          { type: 'text', value: 'I am grateful for ' },
          {
            type: 'link',
            label: 'Dr. Tengfei Zhang',
            href: 'https://sites.google.com/view/tengfeizhang/',
          },
          {
            type: 'text',
            value: ' for letting me be his Research Assistant, and for ',
          },
          {
            type: 'link',
            label: "Ralph Giraud's",
            href: 'https://www.sgiwealth.com/team/ralph-giraud',
          },
          {
            type: 'text',
            value: ' professional development through RUCSFA.',
          },
        ],
      },
    ],
  },
  {
    level: 'Graduate',
    institution: 'Johns Hopkins University',
    degree:
      'M.S.E. Applied Mathematics and Statistics, Whiting School of Engineering',
    relationships: [
      {
        role: 'Thesis advisor',
        name: 'Dr. Luhao Zhang',
        href: 'https://luhao-zhang.github.io/',
      },
      {
        role: 'Mentor',
        name: 'Dr. Yanxun Xu',
        href: 'https://www.ams.jhu.edu/~yxu70/',
      },
    ],
  },
];

export default education;
