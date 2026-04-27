import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { ActivityEntry } from "../types";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  ActivityIcon,
  Dumbbell,
  DumbbellIcon,
  Loader2Icon,
  Plus,
  SparkleIcon,
  TimerIcon,
  Trash2Icon,
} from "lucide-react";
import { quickActivities } from "../assets/assets";
import Input from "../components/ui/Input";
import mockApi from "../assets/mockApi";
import Select from "../components/ui/Select";
import toast from "react-hot-toast";

const Activitylog = () => {
  const { allActivityLogs, setAllActivityLogs } = useAppContext();
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: 0,
    calories: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const loadActivities = () => {
    const todayActivities = allActivityLogs.filter(
      (a: ActivityEntry) => a.createdAt?.split("T")[0] === today,
    );
    setActivities(todayActivities);
  };

  const handleQuickAdd = (activity: { name: string; rate: number }) => {
    setFormData({
      name: activity.name,
      duration: 30,
      calories: 30 * activity.rate,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.duration <= 0) {
      return toast("Please enter valid data");
    }
    try {
      const { data } = await mockApi.activityLogs.create({ data: formData });
      setAllActivityLogs((prev) => [...prev, data]);
      setFormData({
        name: "",
        calories: 0,
        duration: 0,
      });
      setShowForm(false);
    } catch (error: any) {
      console.log(error);
      toast(error?.message || "Failed to add activity");
    }
  };

  const handleDurationChange = (v: string | number) => {
    const duration = Number(v);
    const activity = quickActivities.find((a) => a.name === formData.name);

    let calories = formData.calories;

    if (activity) {
      calories = duration * activity.rate;
    }
    setFormData({
      ...formData,
      duration,
      calories,
    });
  };

  const handleDelete = async(documentId: string)=>{
    try {
      const confirm = window.confirm('Are you sure you want to delete this entry?')
      if(!confirm) return;

      await mockApi.foodLogs.delete(documentId)
      setAllActivityLogs((prev)=>prev.filter((e)=>e.documentId !== documentId))
    } catch (error: any) {
      console.log(error)
      toast.error("Failed to delete food entry")
    }
  }

  useEffect(() => {
    (() => {
      loadActivities();
    })();
  }, [allActivityLogs]);

  const totalMinutes: number = activities.reduce(
    (sum, a) => sum + a.duration,
    0,
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Activity Log
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Track your workouts
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Active Today
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {totalMinutes} min
            </p>
          </div>
        </div>
      </div>
      <div className="page-content-grid">
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Quick Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickActivities.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleQuickAdd(item)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {item.emoji} {item.name}
                  </button>
                ))}
              </div>
            </Card>
            <Button className="w-full" onClick={() => setShowForm(true)}>
              <Plus className="size-5" />
              <p>Add Custom Activity</p>
            </Button>
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <h1 className="font-semibold text-slate-800 dark:text-white mb-4">
              New Activity
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Activity Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.toString() })
                }
                placeholder="e.g, Morning Run"
                required
              />

              <div className="flex gap-4">
                <Input
                  label="Duration (min)"
                  className="flex-1"
                  type="number"
                  value={formData.duration}
                  onChange={handleDurationChange}
                  placeholder="e.g, 30"
                  required
                  min={1}
                  max={300}
                />

                <Input
                  label="Calories Burned"
                  className="flex-1"
                  type="number"
                  value={formData.calories}
                  onChange={(e) =>
                    setFormData({ ...formData, calories: Number(e) })
                  }
                  placeholder="e.g, 200"
                  required
                  min={1}
                  max={2000}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false);
                    setError(" ");
                    setFormData({
                      name: "",
                      calories: 0,
                      duration: 0,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Activity
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Entries List */}
        {activities.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <DumbbellIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-299 mb-2">
              No activities logged today
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Start moving and track your progress
            </p>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <ActivityIcon className="size-5 text-blue-600"/>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Today's Activities</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{activities.length} logged</p>
              </div>
            </div>

            <div className="space-y-2">
              {activities.map((activity)=>(
                <div key={activity.id} className="activity-entry-item">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <TimerIcon className="size-5 text-blue-500 dark:text-blue-400"/>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">{activity.name}</p>
                      <p className="text-sm text-slate-400">{new Date(activity?.createdAt || '').toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{activity.duration} min</p>
                      <p className="text-xs text-slate-400">{activity.calories} kcal</p>
                    </div>
                    <button onClick={()=>handleDelete(activity.documentId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer">
                      <Trash2Icon className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Total summery */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Total Active Time</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{totalMinutes} minutes</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Activitylog;
