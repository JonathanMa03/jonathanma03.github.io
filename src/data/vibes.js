// Rotate a selection by replacing its embedUrl and updating the optional copy.
// The layout, sizing, and animations are handled by the Vibes page.
// change only the link, from spotify's src="" to the embedUrl field
const vibes = {
  currentRotation: {
    label: 'My Current Rotation',
    description:
      'A living playlist of the songs currently blaring in my earphones.',
    embedUrl:
      'https://open.spotify.com/embed/playlist/2oslEtmAQP01zrvmzR42sD?utm_source=generator&theme=0',
    height: 352,
  },
  featuredTrack: {
    label: 'Trending Track',
    description:
      'One track that probably needs an upper bound for the number of replays.',
    embedUrl:
      'https://open.spotify.com/embed/track/0ddcSXm5VzpmviExjNj8X5?utm_source=generator&si=cc7658032e6e42bc',
    height: 152,
  },
  featuredArtist: {
    label: 'Featured Artist',
    description:
      'An artist shaping the mood lately—and well worth a deeper listen, especially for research.',
    embedUrl:
      'https://open.spotify.com/embed/artist/2YvlK6lKiKVjXxsjvNbnqg?utm_source=generator&theme=0',
    height: 352,
  },
  tofuPick: {
    label: "Tofu's Pick",
    description:
      'Personally inspected, paw-approved, and curated by the resident spiritual mascot.',
    embedUrl:
      'https://open.spotify.com/embed/track/3qzqexZ8YEYvaLbfGZedfh?utm_source=generator',
    height: 152,
  },
};

export default vibes;
