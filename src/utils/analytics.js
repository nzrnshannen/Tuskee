import { 
  subDays, subWeeks, subMonths, 
  format, startOfDay, startOfWeek, startOfMonth,
  isSameDay, isSameWeek, isSameMonth,
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  parseISO, getDay
} from 'date-fns';

export const getAllTasks = (records) => {
  if (!records) return [];
  const tasks = [];
  Object.entries(records).forEach(([dateStr, record]) => {
    if (record.todos && Array.isArray(record.todos)) {
      record.todos.forEach(todo => {
        tasks.push({
          ...todo,
          dateStr,
          dateObj: startOfDay(parseISO(dateStr))
        });
      });
    }
  });
  return tasks;
};

export const getDailyStats = (tasks, days = 14) => {
  const today = startOfDay(new Date());
  const startDate = subDays(today, days - 1);
  
  const intervals = eachDayOfInterval({ start: startDate, end: today });
  
  return intervals.map(day => {
    const dayTasks = tasks.filter(t => isSameDay(t.dateObj, day));
    const completed = dayTasks.filter(t => t.completed).length;
    return {
      label: format(day, 'MMM d'),
      fullDate: format(day, 'yyyy-MM-dd'),
      completed,
      total: dayTasks.length
    };
  });
};

export const getWeeklyStats = (tasks, weeks = 12) => {
  const today = new Date();
  const startDate = startOfWeek(subWeeks(today, weeks - 1));
  
  const intervals = eachWeekOfInterval({ start: startDate, end: today });
  
  return intervals.map(weekStart => {
    const weekTasks = tasks.filter(t => isSameWeek(t.dateObj, weekStart));
    const completed = weekTasks.filter(t => t.completed).length;
    return {
      label: `Week ${format(weekStart, 'I')}`,
      fullDate: `Week of ${format(weekStart, 'MMM d, yyyy')}`,
      completed,
      total: weekTasks.length
    };
  });
};

export const getMonthlyStats = (tasks, months = 12) => {
  const today = new Date();
  const startDate = startOfMonth(subMonths(today, months - 1));
  
  const intervals = eachMonthOfInterval({ start: startDate, end: today });
  
  return intervals.map(monthStart => {
    const monthTasks = tasks.filter(t => isSameMonth(t.dateObj, monthStart));
    const completed = monthTasks.filter(t => t.completed).length;
    return {
      label: format(monthStart, 'MMM'),
      fullDate: format(monthStart, 'MMMM yyyy'),
      completed,
      total: monthTasks.length
    };
  });
};

export const getYearlyStats = (tasks) => {
  if (tasks.length === 0) return [];
  
  const years = tasks.map(t => t.dateObj.getFullYear());
  const minYear = Math.min(...years);
  const currentYear = new Date().getFullYear();
  
  const result = [];
  for (let y = minYear; y <= currentYear; y++) {
    const yearTasks = tasks.filter(t => t.dateObj.getFullYear() === y);
    const completed = yearTasks.filter(t => t.completed).length;
    result.push({
      label: y.toString(),
      fullDate: y.toString(),
      completed,
      total: yearTasks.length
    });
  }
  return result;
};

export const getKPIs = (tasks) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed);
  const totalCompleted = completedTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  
  let currentStreak = 0;
  const today = startOfDay(new Date());
  
  const completedDays = [...new Set(completedTasks.map(t => t.dateStr))].sort().reverse();
  
  if (completedDays.length > 0) {
    let checkDate = today;
    let foundGap = false;
    
    if (!completedDays.includes(format(today, 'yyyy-MM-dd'))) {
        checkDate = subDays(today, 1);
        if (!completedDays.includes(format(checkDate, 'yyyy-MM-dd'))) {
            foundGap = true;
        }
    }

    if (!foundGap) {
        let iterDate = checkDate;
        while(completedDays.includes(format(iterDate, 'yyyy-MM-dd'))) {
            currentStreak++;
            iterDate = subDays(iterDate, 1);
        }
    }
  }

  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  completedTasks.forEach(t => {
    dayCounts[getDay(t.dateObj)]++;
  });
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts, 1));
  const peakDay = totalCompleted > 0 ? daysOfWeek[maxDayIndex] : 'None';

  return {
    totalCompleted,
    completionRate,
    currentStreak,
    peakDay
  };
};

export const generateInsights = (tasks) => {
    if (tasks.length === 0) return "Start tracking tasks to see your insights!";
    
    const kpis = getKPIs(tasks);
    const thisWeek = getWeeklyStats(tasks, 2)[1];
    const lastWeek = getWeeklyStats(tasks, 2)[0];

    if (thisWeek && lastWeek) {
        if (thisWeek.completed > lastWeek.completed && lastWeek.completed > 0) {
            const percent = Math.round(((thisWeek.completed - lastWeek.completed) / lastWeek.completed) * 100);
            return `🔥 You completed ${percent}% more tasks this week compared to last week! Keep it up! Your peak productivity day is ${kpis.peakDay}.`;
        }
    }

    if (kpis.currentStreak >= 3) {
        return `🔥 You are on a ${kpis.currentStreak}-day streak! Consistency is key.`;
    }

    if (kpis.totalCompleted > 0) {
        return `You've completed ${kpis.totalCompleted} tasks so far. Your most productive day of the week is ${kpis.peakDay}. Keep going!`;
    }

    return "Keep adding and completing tasks to build up your productivity profile!";
};
