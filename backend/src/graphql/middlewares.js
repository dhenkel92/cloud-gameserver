'use strict';

module.exports = {
  filterUsers: async(next, parent, args, context, info) => {
    const newArgs = {
      ...args,
      filters: {
        ...args.filters,
        users_permissions_users: {
          id: {
            eq: context.state.user.id,
          },
        },
      }
    }
    return next(parent, newArgs, context, info);
  }
}
