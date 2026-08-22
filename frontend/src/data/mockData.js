export const mockEvents = [
  {
    id: 1,
    title: "AI & Machine Learning Workshop",
    category: "Technology",
    date: "Aug 28, 2026",
    dateGroup: "This Week",
    time: "10:00 AM – 4:30 PM",
    startTime: "10:00",
    endTime: "16:30",
    location: "Assam down town University, Guwahati",
    attendees: 86,
    capacity: 100,
    organizer: "Tech Club",
    description:
      "Join us for an engaging hands-on workshop covering the foundations of Artificial Intelligence and Machine Learning.",
    image:
      "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-800",
    status: "Published",
  },
  {
    id: 2,
    title: "Future of Web Development",
    category: "Technology",
    date: "Sep 02, 2026",
    dateGroup: "Next Month",
    time: "11:00 AM – 3:00 PM",
    startTime: "11:00",
    endTime: "15:00",
    location: "Guwahati, Assam",
    attendees: 124,
    capacity: 150,
    organizer: "Developer Community",
    description:
      "Explore modern web development technologies, architecture and development practices.",
    image:
      "bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-800",
    status: "Published",
  },
  {
    id: 3,
    title: "Career & Placement Summit",
    category: "Career",
    date: "Sep 08, 2026",
    dateGroup: "Next Month",
    time: "09:30 AM – 5:00 PM",
    startTime: "09:30",
    endTime: "17:00",
    location: "Guwahati Convention Centre",
    attendees: 218,
    capacity: 250,
    organizer: "Career Launchpad",
    description:
      "Connect with industry professionals and gain practical insights into career preparation and placements.",
    image:
      "bg-gradient-to-br from-orange-500 via-red-500 to-rose-700",
    status: "Published",
  },
  {
    id: 4,
    title: "React Masterclass",
    category: "Technology",
    date: "Aug 30, 2026",
    dateGroup: "This Week",
    time: "02:00 PM – 6:00 PM",
    startTime: "14:00",
    endTime: "18:00",
    location: "Guwahati Tech Hub",
    attendees: 72,
    capacity: 100,
    organizer: "Frontend Community",
    description:
      "A practical React masterclass covering component architecture, state management and modern React development.",
    image:
      "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700",
    status: "Published",
  },
  {
    id: 5,
    title: "Creative Design Workshop",
    category: "Creative",
    date: "Sep 05, 2026",
    dateGroup: "Next Month",
    time: "02:00 PM – 6:00 PM",
    startTime: "14:00",
    endTime: "18:00",
    location: "Design Studio, Guwahati",
    attendees: 54,
    capacity: 80,
    organizer: "Creative Circle",
    description:
      "Learn practical design thinking, visual communication and creative problem-solving techniques.",
    image:
      "bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-700",
    status: "Published",
  },
  {
    id: 6,
    title: "Future Leaders Seminar",
    category: "Education",
    date: "Sep 12, 2026",
    dateGroup: "Next Month",
    time: "10:00 AM – 4:00 PM",
    startTime: "10:00",
    endTime: "16:00",
    location: "City Convention Hall",
    attendees: 160,
    capacity: 200,
    organizer: "Leadership Forum",
    description:
      "Develop leadership skills, communication abilities and practical strategies for professional growth.",
    image:
      "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700",
    status: "Published",
  },
]

export const mockCategories = [
  {
    name: "Technology",
    count: 86,
  },
  {
    name: "Career",
    count: 42,
  },
  {
    name: "Education",
    count: 64,
  },
  {
    name: "Workshops",
    count: 38,
  },
  {
    name: "Conferences",
    count: 27,
  },
  {
    name: "Creative",
    count: 31,
  },
]

export const mockRegistrations = [
  {
    id: 1,
    eventId: 1,
    status: "Confirmed",
    type: "upcoming",
  },
  {
    id: 2,
    eventId: 2,
    status: "Confirmed",
    type: "upcoming",
  },
  {
    id: 3,
    eventId: 3,
    status: "Confirmed",
    type: "upcoming",
  },
  {
    id: 4,
    eventId: 4,
    status: "Completed",
    type: "past",
  },
  {
    id: 5,
    eventId: 5,
    status: "Completed",
    type: "past",
  },
]

export const mockDashboardStats = [
  {
    label: "Total Events",
    value: "12",
    change: "+3 this month",
  },
  {
    label: "Registrations",
    value: "486",
    change: "+18.4% this month",
  },
  {
    label: "Total Attendees",
    value: "1,284",
    change: "+12.6% this month",
  },
  {
    label: "Upcoming Events",
    value: "5",
    change: "Next event in 6 days",
  },
]

export const mockAnalytics = [
  { month: "Apr", registrations: 120 },
  { month: "May", registrations: 165 },
  { month: "Jun", registrations: 142 },
  { month: "Jul", registrations: 210 },
  { month: "Aug", registrations: 278 },
  { month: "Sep", registrations: 245 },
]