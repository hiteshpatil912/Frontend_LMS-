export const initialCertificateTemplates = [
  {
    id: 1,
    name: 'Enterprise Completion Certificate',
    status: 'active',
    accentColor: 'brand',
    description: 'Default print-ready completion certificate for LMS courses.',
    requiredRules: ['All lessons completed', 'Quiz passed', 'Course completed']
  },
  {
    id: 2,
    name: 'Instructor Signature Template',
    status: 'draft',
    accentColor: 'emerald',
    description: 'Alternate certificate layout with instructor sign-off.',
    requiredRules: ['Course completed', 'Instructor approval']
  }
]
