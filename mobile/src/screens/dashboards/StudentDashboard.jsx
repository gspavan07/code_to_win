import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import StatsCard from '../../components/ui/StatsCard';
import PlatformCard from '../../components/ui/PlatformCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'src/contexts/ThemeContext';
export default function StudentDashboard() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { currentUser, checkAuth, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const easy =
    currentUser.performance.platformWise.leetcode.easy +
    currentUser.performance.platformWise.gfg.school +
    currentUser.performance.platformWise.gfg.basic +
    currentUser.performance.platformWise.gfg.easy;

  const medium =
    currentUser.performance.platformWise.leetcode.medium +
    currentUser.performance.platformWise.codechef.problems +
    currentUser.performance.platformWise.gfg.medium;

  const hard =
    currentUser.performance.platformWise.leetcode.hard +
    currentUser.performance.platformWise.gfg.hard;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('http://10.50.25.99:5000/api/student/refresh-coding-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.student_id }),
      });
      if (!res.ok) throw new Error('Refresh failed');
      await checkAuth();
    } catch (e) {
      console.error(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="dark:bg-gray-950" style={{ flex: 1, paddingTop: insets.top }}>
      <View className="flex-row items-center justify-end px-5 pt-2">
        <TouchableOpacity
          onPress={logout}
          className="flex-row items-center gap-1 rounded-lg bg-red-100 px-3 py-2 dark:bg-red-900">
          <Ionicons name="log-out-outline" size={20} color={theme === 'dark' ? 'white' : 'red'} />
          <Text className="font-semibold text-red-700 dark:text-white">Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 p-5">
        {/* Avatar & Name */}
        <View className="mb-6 flex items-center justify-center">
          <View className="mb-2 h-32 w-32 items-center justify-center rounded-full bg-blue-100 dark:bg-gray-800">
            <Text className="text-5xl font-bold text-blue-800 dark:text-gray-200">
              {currentUser.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </Text>
          </View>
          <Text className="text-xl font-bold dark:text-white">{currentUser.name}</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            University Rank: {currentUser.overall_rank}
          </Text>
        </View>

        {/* Profile Info Badges */}
        <View className="mb-4 flex-row flex-wrap justify-between gap-2">
          {[
            { label: 'Campus', value: currentUser.college },
            { label: 'Degree', value: currentUser.degree },
            { label: 'Dept', value: currentUser.dept_name },
            { label: 'Year', value: currentUser.year },
            { label: 'Section', value: currentUser.section },
          ].map((info) => (
            <Text
              key={info.label}
              className="rounded-full bg-white px-3 py-2 text-sm text-gray-800 shadow dark:bg-gray-700 dark:text-gray-200">
              {info.label}: <Text className="font-semibold">{info.value}</Text>
            </Text>
          ))}
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          onPress={handleRefresh}
          className="mb-4 flex-row items-center justify-center gap-2 rounded-xl bg-white p-3 shadow dark:bg-gray-700 "
          disabled={refreshing}>
          <Ionicons
            name="refresh"
            size={20}
            color={theme === 'dark' ? 'white' : 'black'}
            className={`dark:text-white ${refreshing && 'animate-spin '}`}
          />
          <Text className="font-semibold dark:text-white">
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Text>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View className="mb-4 flex flex-row flex-wrap justify-between gap-3">
          <StatsCard
            icon="code-tags"
            color="blue"
            title="Total"
            value={currentUser.performance.combined.totalSolved}
          />
          <StatsCard icon="numeric-1-circle-outline" color="purple" title="Easy" value={easy} />
          <StatsCard
            icon="numeric-2-circle-outline"
            color="warning"
            title="Medium"
            value={medium}
          />
          <StatsCard icon="fire" color="error" title="Hard" value={hard} />
        </View>

        {/* Platform Performance Cards */}
        <View className="mb-12 flex gap-2">
          <PlatformCard
            name="LeetCode"
            className={'text-yellow-500'}
            logo={require('../../../assets/leetcode.png')}
            total={
              currentUser.performance.platformWise.leetcode.easy +
              currentUser.performance.platformWise.leetcode.medium +
              currentUser.performance.platformWise.leetcode.hard
            }
            breakdown={{
              Easy: currentUser.performance.platformWise.leetcode.easy,
              Medium: currentUser.performance.platformWise.leetcode.medium,
              Hard: currentUser.performance.platformWise.leetcode.hard,
              Contests: currentUser.performance.platformWise.leetcode.contests,
              Badges: currentUser.performance.platformWise.leetcode.badges,
            }}
          />
          <PlatformCard
            name="CodeChef"
            className={'text-orange-950'}
            logo={require('../../../assets/codechef.png')}
            total={currentUser.performance.platformWise.codechef.contests}
            subtitle="Contests Participated"
            breakdown={{
              Solved: currentUser.performance.platformWise.codechef.problems,
              Stars: currentUser.performance.platformWise.codechef.stars,
              Badges: currentUser.performance.platformWise.codechef.badges,
            }}
          />
          <PlatformCard
            name="GeeksforGeeks"
            className={'text-green-700'}
            logo={require('../../../assets/gfg.png')}
            total={
              currentUser.performance.platformWise.gfg.school +
              currentUser.performance.platformWise.gfg.basic +
              currentUser.performance.platformWise.gfg.easy +
              currentUser.performance.platformWise.gfg.medium +
              currentUser.performance.platformWise.gfg.hard
            }
            breakdown={{
              School: currentUser.performance.platformWise.gfg.school,
              Basic: currentUser.performance.platformWise.gfg.basic,
              Easy: currentUser.performance.platformWise.gfg.easy,
              Medium: currentUser.performance.platformWise.gfg.medium,
              Hard: currentUser.performance.platformWise.gfg.hard,
            }}
          />
          <PlatformCard
            name="HackerRank"
            className={''}
            logo={require('../../../assets/hackerrank.png')}
            total={currentUser.performance.platformWise.hackerrank.badges}
            subtitle="Badges Gained"
          />
        </View>
      </ScrollView>
    </View>
  );
}
