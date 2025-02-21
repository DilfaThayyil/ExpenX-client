export const transformGroups = (groups: any[]) => {
    return groups.map((group: any) => ({
      id: group._id || group.id,
      name: group.name,
      totalExpenses: 0,
      memberCount: group.members ? group.members.length : 0,
      balance: 0,
      lastActivity: group.expenses && group.expenses.length > 0
        ? group.expenses[group.expenses.length - 1].description
        : 'No recent activity',
      members: group.members
        ? group.members.map((memberEmail: string) => ({
            id: memberEmail.replace('@', '_'),
            name: memberEmail.split('@')[0],
            email: memberEmail,
            avatar: `https://ui-avatars.com/api/?name=${memberEmail.split('@')[0]}`,
            paid: 0,
            owed: 0
          }))
        : [],
      expenses: group.expenses || [],
      splitMethod: group.splitMethod || 'equal'
    }));
  };
  