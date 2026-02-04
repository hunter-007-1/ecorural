import { create } from 'zustand';

type ActivityType = 'Walk' | 'Bike' | 'PublicTransport';

interface UserStats {
  greenCoins: number;
  carbonSaved: number;
  caloriesBurned: number;
  title: string;
}

interface Actions {
  convertActivityToPoints: (type: ActivityType, value: number) => void;
  getTitle: (carbonSaved: number) => string;
}

type UseStore = UserStats & Actions;

export const getTitle = (carbonSaved: number): string => {
  if (carbonSaved < 10) return '绿芽';
  if (carbonSaved <= 50) return '青苗';
  return '金穗';
};

export const useStore = create<UseStore>()((set, get) => ({
  greenCoins: 0,
  carbonSaved: 0,
  caloriesBurned: 0,
  title: '绿芽',

  convertActivityToPoints: (type: ActivityType, value: number) => {
    const { greenCoins, carbonSaved, caloriesBurned } = get();

    let points = 0;
    let carbonReduction = 0;
    let calories = 0;

    switch (type) {
      case 'Walk':
        carbonReduction = (value / 1000) * 0.15;
        calories = (value / 1000) * 30;
        points = Math.floor(value / 1000) * 5;
        break;
      case 'Bike':
        carbonReduction = value * 0.25;
        calories = value * 40;
        points = value * 10;
        break;
      case 'PublicTransport':
        carbonReduction = value * 0.5;
        points = value * 15;
        break;
    }

    const newCarbonSaved = carbonSaved + carbonReduction;
    const newTitle = getTitle(newCarbonSaved);

    set({
      greenCoins: greenCoins + points,
      carbonSaved: newCarbonSaved,
      caloriesBurned: caloriesBurned + calories,
      title: newTitle,
    });
  },

  getTitle,
}));
