export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  templateName: string;
  rating: number;
  date: string;
  verified: boolean;
  avatarInitials: string;
  avatarColor: string;
  review: string;
}

export const genuineReviews: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Tanmay & Ananya",
    location: "Pune",
    templateName: "Happy Birthday Madam",
    rating: 5,
    date: "2 days ago",
    verified: true,
    avatarInitials: "TA",
    avatarColor: "from-pink-500 to-rose-500",
    review:
      "Ordered the 'Happy Birthday Madam' template for my girlfriend's 22nd birthday. Sent Eren 18 photos and our favorite song at 10 PM, and got the live link on WhatsApp by 1 AM. When she opened it at midnight on FaceTime she literally started crying happy tears. Best surprise ever!",
  },
  {
    id: "rev-2",
    name: "Rohan Verma",
    location: "New Delhi",
    templateName: "Supportive Website For Her",
    rating: 5,
    date: "4 days ago",
    verified: true,
    avatarInitials: "RV",
    avatarColor: "from-blue-500 to-indigo-500",
    review:
      "Bought the 'Supportive Website For Her' while she was stressed preparing for her exams. Having a personalized website with our memories and motivation letters to open during study breaks completely melted her heart. She bookmarked it on her home screen.",
  },
  {
    id: "rev-3",
    name: "Aditya K.",
    location: "Bengaluru",
    templateName: "Love Proposal 2.0",
    rating: 5,
    date: "1 week ago",
    verified: true,
    avatarInitials: "AK",
    avatarColor: "from-red-500 to-pink-500",
    review:
      "Used 'Love Proposal 2.0' to propose on our beach trip. The 'No' button running away whenever she tried clicking it had us laughing so hard, and then the fireworks and our photos popped up when she clicked YES! Truly magical.",
  },
  {
    id: "rev-4",
    name: "Priya & Samar",
    location: "Mumbai",
    templateName: "Happy Anniversary 2.0",
    rating: 5,
    date: "1 week ago",
    verified: true,
    avatarInitials: "PS",
    avatarColor: "from-purple-500 to-pink-500",
    review:
      "Ordered 'Happy Anniversary 2.0' for our 2nd anniversary. The timeline with our milestone dates and our song playing softly in the background made it so emotional. Eren even fixed a typo in my text within 5 minutes on WhatsApp!",
  },
  {
    id: "rev-5",
    name: "Kabir S.",
    location: "Hyderabad",
    templateName: "Sorry 2.0",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    avatarInitials: "KS",
    avatarColor: "from-amber-500 to-rose-500",
    review:
      "We had a huge misunderstanding and weren't talking. I sent her the 'Sorry 2.0' website with a sincere letter and photos from our first trip. She called me 10 minutes later crying and forgave me immediately. This website literally saved our relationship.",
  },
  {
    id: "rev-6",
    name: "Devika Nair",
    location: "Kochi",
    templateName: "Happy Boyfriend Day",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    avatarInitials: "DN",
    avatarColor: "from-emerald-500 to-teal-500",
    review:
      "Surprised my boyfriend for Boyfriend Day. Guys rarely get sentimental digital gifts like this, and he was genuinely speechless when he saw the dark theme with his favorite photos and our Spotify song. 10/10 recommend!",
  },
  {
    id: "rev-7",
    name: "Tanya Sen",
    location: "Kolkata",
    templateName: "Happy Birthday Bestie",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    avatarInitials: "TS",
    avatarColor: "from-violet-500 to-purple-500",
    review:
      "Ordered 'Happy Birthday Bestie' for my childhood best friend turning 25. The inside jokes gallery and countdown timer had our entire friend group dying of laughter. Super clean mobile layout, zero lag on iPhone.",
  },
  {
    id: "rev-8",
    name: "Marcus L.",
    location: "London, UK",
    templateName: "Importance Website for her",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    avatarInitials: "ML",
    avatarColor: "from-sky-500 to-blue-600",
    review:
      "Ordered from London using international payment. Delivery was faster than expected — around 3 hours! The animation smoothness and mobile layout on 'Importance Website for her' exceeded all expectations.",
  },
  {
    id: "rev-9",
    name: "Zainab M.",
    location: "Lahore",
    templateName: "Happy Girlfriend Day",
    rating: 5,
    date: "1 month ago",
    verified: true,
    avatarInitials: "ZM",
    avatarColor: "from-fuchsia-500 to-rose-500",
    review:
      "Got 'Happy Girlfriend Day' as an anniversary surprise. She loved the Polaroid photo cards and the secret message at the end. She posted the link on her private story and all her friends were asking where I got it made!",
  },
  {
    id: "rev-10",
    name: "Farhan A.",
    location: "Karachi",
    templateName: "Happy Birthday My Love",
    rating: 5,
    date: "1 month ago",
    verified: true,
    avatarInitials: "FA",
    avatarColor: "from-teal-500 to-cyan-500",
    review:
      "I was skeptical because the price seemed too reasonable for a full custom website, but 'Happy Birthday My Love' was phenomenal. Music started playing smoothly, photos loaded in HD, and WhatsApp support was super patient.",
  },
  {
    id: "rev-11",
    name: "Sneha & Rishabh",
    location: "Delhi NCR",
    templateName: "Happy Birthday Madam",
    rating: 5,
    date: "1 month ago",
    verified: true,
    avatarInitials: "SR",
    avatarColor: "from-rose-500 to-pink-600",
    review:
      "The 'Happy Birthday Madam' site was absolute perfection. She kept rereading the 'Reasons why you are special' cards over and over again. It's been weeks and she still has the link pinned in her browser.",
  },
  {
    id: "rev-12",
    name: "Amanpreet Singh",
    location: "Chandigarh",
    templateName: "Love Proposal 2.0",
    rating: 5,
    date: "1 month ago",
    verified: true,
    avatarInitials: "AS",
    avatarColor: "from-orange-500 to-amber-500",
    review:
      "Ordered 'Love Proposal 2.0' with custom photos and our background song. The interactive animations were butter smooth on her phone. Customer service was super responsive on WhatsApp. Worth every rupee!",
  },
];
