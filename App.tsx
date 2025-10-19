import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Meal, Nutrients, Checkin, Mood, Workout } from './types';
import { analyzeMeal, getSmartSuggestion } from './services/geminiService';
import ProgressBar from './components/ProgressBar';
import LoaderIcon from './components/icons/LoaderIcon';
import TrashIcon from './components/icons/TrashIcon';
import DailyCheckin from './components/wellbeing/DailyCheckin';
import CheckinHistory from './components/wellbeing/CheckinHistory';
import HydrationTracker from './components/fitness/HydrationTracker';
import WorkoutLogger from './components/fitness/WorkoutLogger';
import WorkoutHistory from './components/fitness/WorkoutHistory';

const App: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>(() => {
    try {
      const saved = localStorage.getItem('nutriai-meals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [checkins, setCheckins] = useState<Checkin[]>(() => {
    try {
      const saved = localStorage.getItem('nutriai-checkins');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const saved = localStorage.getItem('nutriai-workouts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hydration, setHydration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nutriai-hydration');
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [mealInput, setMealInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string>('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('nutriai-meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('nutriai-checkins', JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    localStorage.setItem('nutriai-workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('nutriai-hydration', JSON.stringify(hydration));
  }, [hydration]);

  const dailyGoals: Nutrients = useMemo(() => ({
    calories: 2500,
    protein: 180,
    carbs: 300,
    fat: 70,
  }), []);

  const hydrationGoal = 3000; // 3L in ml

  const dailyTotals = useMemo<Nutrients>(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const fetchSuggestion = useCallback(async () => {
    if (meals.length === 0 && checkins.length === 0 && workouts.length === 0 && hydration === 0) {
      setSuggestion("Log your first activity to get a smart suggestion!");
      return;
    }
    setIsSuggestionLoading(true);
    try {
      const latestMeal = meals.length > 0 ? meals[meals.length - 1] : undefined;
      const latestCheckin = checkins.length > 0 ? checkins[checkins.length - 1] : undefined;
      const newSuggestion = await getSmartSuggestion(dailyGoals, dailyTotals, latestMeal?.description, latestCheckin?.mood, workouts, { current: hydration, goal: hydrationGoal });
      setSuggestion(newSuggestion);
    } catch (err) {
      setSuggestion("Could not get a suggestion right now.");
    } finally {
      setIsSuggestionLoading(false);
    }
  }, [dailyGoals, dailyTotals, meals, checkins, workouts, hydration, hydrationGoal]);

  useEffect(() => {
    const suggestionDebounce = setTimeout(() => {
        fetchSuggestion();
    }, 1000);
    return () => clearTimeout(suggestionDebounce);
  }, [fetchSuggestion]);

  const handleLogMeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mealInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const nutrients = await analyzeMeal(mealInput);
      const newMeal: Meal = {
        id: new Date().toISOString(),
        description: mealInput,
        ...nutrients,
      };
      setMeals(prevMeals => [...prevMeals, newMeal]);
      setMealInput('');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
  };

  const handleSaveCheckin = (mood: Mood, journal: string, gratitude: string) => {
    const newCheckin: Checkin = {
        id: new Date().toISOString(),
        date: new Date().toDateString(),
        mood,
        journal,
        gratitude,
    };
    setCheckins(prev => [...prev, newCheckin]);
  };

  const handleLogWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      id: new Date().toISOString(),
      ...workout,
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const handleRemoveWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const handleUpdateHydration = (amount: number) => {
    setHydration(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            NutriAI Catalyst
          </h1>
          <p className="text-gray-400 mt-2">Your AI-powered nutrition and wellbeing partner.</p>
        </header>

        <main className="space-y-8">
          <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Daily Progress</h2>
            <div className="space-y-4">
              <ProgressBar label="Calories" value={dailyTotals.calories} max={dailyGoals.calories} unit="kcal" color="bg-red-500" />
              <ProgressBar label="Protein" value={dailyTotals.protein} max={dailyGoals.protein} unit="g" color="bg-sky-500" />
              <ProgressBar label="Carbs" value={dailyTotals.carbs} max={dailyGoals.carbs} unit="g" color="bg-orange-500" />
              <ProgressBar label="Fat" value={dailyTotals.fat} max={dailyGoals.fat} unit="g" color="bg-yellow-500" />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <HydrationTracker current={hydration} goal={hydrationGoal} onUpdate={handleUpdateHydration} />
            </div>
          </section>

           <section className="bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 p-5 rounded-2xl border border-emerald-700/50 shadow-md">
                <h3 className="font-bold text-lg mb-2 text-emerald-300">AI Smart Suggestion</h3>
                <div className="text-gray-200 h-12 flex items-center">
                    {isSuggestionLoading ? <LoaderIcon className="w-5 h-5 text-emerald-400"/> : <p>"{suggestion}"</p>}
                </div>
            </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">Log a Meal</h2>
              <form onSubmit={handleLogMeal} className="space-y-4">
                <textarea
                  value={mealInput}
                  onChange={(e) => setMealInput(e.target.value)}
                  placeholder="e.g., Chicken breast, 1 cup of brown rice, and a side of steamed broccoli"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 resize-none h-28"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:text-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                  disabled={isLoading || !mealInput.trim()}
                >
                  {isLoading ? (<><LoaderIcon /> Analyzing...</>) : ("Analyze & Log Meal")}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </form>
            </section>

            <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">Today's Meals</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {meals.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No meals logged yet.</p>
                ) : (
                  [...meals].reverse().map((meal) => (
                    <div key={meal.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600 group">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-200 break-all pr-2">{meal.description}</p>
                        <button onClick={() => handleRemoveMeal(meal.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400" aria-label="Delete meal">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-400 mt-2">
                          <span>🔥 {Math.round(meal.calories)} kcal</span>
                          <span>💪 {Math.round(meal.protein)}g P</span>
                          <span>🍞 {Math.round(meal.carbs)}g C</span>
                          <span>🥑 {Math.round(meal.fat)}g F</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Fitness Hub</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WorkoutLogger onLog={handleLogWorkout} />
                <WorkoutHistory workouts={workouts} onRemove={handleRemoveWorkout} />
            </div>
          </section>
          
          <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Daily Wellbeing Check-in</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DailyCheckin onSave={handleSaveCheckin} />
                <CheckinHistory checkins={checkins} />
            </div>
          </section>

        </main>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #374151; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #059669; }
      `}</style>
    </div>
  );
};

export default App;