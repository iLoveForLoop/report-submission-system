// Import images using relative paths from this file
import Ernest from '../../../../images/developers/ernest.jpg';
import Jeric from '../../../../images/developers/jeric.jpg';
import MDC_LOGO from '../../../../images/developers/MDC_LOGO.png';

// Types
export interface Developer {
  name: string;
  image: string;
  email: string;
  bio: string;
  skills: string[];
  responsibilities: string[];
}

export interface Adviser {
  name: string;
  image: string;
  email: string;
  role: string;
  department: string;
  bio: string;
  skills: string[];
  responsibilities: string[];
}

// Adviser data
export const adviserData: Adviser = {
  name: 'Benjie A. Lenteria',
  image: Ernest,
  email: 'balenteria@materdeicollege.edu.ph',
  role: 'Adviser',
  department: 'IT Department',
  bio: 'IT Department Adviser at Mater Dei College with expertise in software development and project management.',
  skills: ['Project Management', 'Software Architecture', 'Mentoring'],
  responsibilities: [
    'Project Supervision',
    'Technical Guidance',
    'Quality Assurance',
  ],
};

// Developers data
export const developersData: Developer[] = [
  {
    name: 'Ernesto Cabarrubias Jr.',
    image: Ernest,
    email: 'ernestojrcabarrubias@gmail.com',
    bio: 'Full-stack developer with expertise in React, TypeScript, and cloud technologies. Passionate about creating efficient and scalable web applications.',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'MongoDB'],
    responsibilities: [
      'System Architecture',
      'Backend Development',
      'Team Coordination',
      'Deployment',
    ],
  },
  {
    name: 'Jeferson Bayking',
    image: Ernest,
    email: 'jefersonbayking@example.com',
    bio: 'Frontend specialist with focus on user experience and modern web technologies.',
    skills: ['React', 'CSS', 'UI/UX Design', 'JavaScript'],
    responsibilities: [
      'UI Development',
      'User Experience',
      'Frontend Testing',
    ],
  },
  {
    name: 'John Jeric Polison',
    image: Jeric,
    email: 'johnjericpolison@gmail.com',
    bio: 'Backend engineer specializing in server-side logic, database design, and API development.',
    skills: [
      'Node.js',
      'Express',
      'PostgreSQL',
      'REST APIs',
      'Authentication',
    ],
    responsibilities: [
      'API Development',
      'Database Design',
      'Server Management',
      'Security',
    ],
  },
  {
    name: 'Jose Victor Alampayan',
    image: Ernest,
    email: 'josevictoralampayan@example.com',
    bio: 'Versatile developer experienced in both frontend and backend technologies.',
    skills: ['React', 'Node.js', 'Python', 'Docker', 'Git'],
    responsibilities: [
      'Feature Development',
      'Bug Fixing',
      'Code Review',
      'Documentation',
    ],
  },
  {
    name: 'Paul Jacob Tocmo',
    image: Ernest,
    email: 'pauljacobtocmo@example.com',
    bio: 'UI/UX focused developer with attention to detail and responsive design.',
    skills: ['React', 'Tailwind CSS', 'Figma', 'TypeScript', 'Testing'],
    responsibilities: [
      'Component Development',
      'Responsive Design',
      'Performance Optimization',
    ],
  },
  {
    name: 'Bruce Unabia',
    image: Ernest,
    email: 'bruceunabia@example.com',
    bio: 'QA specialist ensuring software quality through rigorous testing and validation.',
    skills: ['Testing', 'Automation', 'Debugging', 'Documentation'],
    responsibilities: [
      'Testing',
      'Bug Reporting',
      'Quality Assurance',
      'User Acceptance Testing',
    ],
  },
].sort((a, b) => a.name.localeCompare(b.name));

// MDC Logo
export const mdcLogo = MDC_LOGO;
