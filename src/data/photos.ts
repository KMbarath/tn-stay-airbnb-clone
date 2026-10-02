export type SceneKind = 'living1' | 'living2' | 'kitchen' | 'bedroom' | 'bathroom' | 'gym' | 'exterior' | 'pool' | 'extra';

export interface PhotoCategory {
  id: string;
  title: string;
  kind: SceneKind;
  count: number;
  /** short amenity line shown in the Photo tour */
  details: string;
}

export interface Photo {
  index: number;
  src: string;
  alt: string;
  categoryId: string;
  categoryTitle: string;
}

export const categories: PhotoCategory[] = [
  { id: 'living-room-1', title: 'Living room 1', kind: 'living1', count: 5, details: 'Sofa · Air conditioning · Ceiling fan · TV' },
  { id: 'living-room-2', title: 'Living room 2', kind: 'living2', count: 4, details: 'Sofa · Air conditioning · Jacuzzi access' },
  { id: 'full-kitchen', title: 'Full kitchen', kind: 'kitchen', count: 5, details: 'Refrigerator · Induction stove · Microwave · Kettle' },
  { id: 'bedroom', title: 'Bedroom', kind: 'bedroom', count: 6, details: '1 queen bed · Wardrobe · Air conditioning · Mirror' },
  { id: 'full-bathroom', title: 'Full bathroom', kind: 'bathroom', count: 4, details: 'Hot water · Shower · Hair dryer · Toiletries' },
  { id: 'gym', title: 'Gym', kind: 'gym', count: 4, details: 'Treadmill · Dumbbells · Cross trainer' },
  { id: 'exterior', title: 'Exterior', kind: 'exterior', count: 6, details: 'Mountain view · Free parking · Lift' },
  { id: 'pool', title: 'Pool', kind: 'pool', count: 4, details: 'Shared pool · Sun loungers · Open 7 am to 8 pm' },
  { id: 'additional-photos', title: 'Additional photos', kind: 'extra', count: 5, details: 'Private jacuzzi · Garden seating · Plants' },
];

const photoSets: Record<SceneKind, string[]> = {
  living1: ['/photos/ref-000.jpg', '/photos/ref-001.jpg'],
  living2: ['/photos/ref-014.jpg', '/photos/ref-000.jpg'],
  kitchen: ['/photos/kitchen.jpg'],
  bedroom: ['/photos/ref-003.jpg', '/photos/ref-012.jpg'],
  bathroom: ['/photos/bathroom.jpg'],
  gym: ['/photos/gym.jpg'],
  exterior: ['/photos/exterior-luxury.jpg', '/photos/exterior-luxury.jpg'],
  pool: ['/photos/pool.jpg'],
  extra: ['/photos/ref-002.jpg', '/photos/ref-001.jpg', '/photos/ref-000.jpg'],
};

export const photoForKind = (kind: SceneKind, index = 0) => photoSets[kind][index % photoSets[kind].length];

let counter = 0;
export const photos: Photo[] = categories.flatMap((cat) =>
  Array.from({ length: cat.count }, (_, i) => {
    const index = counter++;
    return {
      index,
      src: photoForKind(cat.kind, i),
      alt: `${cat.title}, photo ${i + 1} of ${cat.count}`,
      categoryId: cat.id,
      categoryTitle: cat.title,
    };
  }),
);

export const photosByCategory = (id: string) => photos.filter((p) => p.categoryId === id);

/** Hero order mirrors the reference: big living area, then four supporting shots */
const extra = photosByCategory('additional-photos');
export const heroPhotos: Photo[] = [
  extra[0],
  photosByCategory('living-room-2')[0],
  extra[1],
  photosByCategory('bedroom')[0],
  photosByCategory('exterior')[0],
];
