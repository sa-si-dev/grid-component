export const filterConfig = {
  types: {
    text: {
      criteria: ['contains', 'is', 'is_not', 'not_contains', 'starts_with', 'ends_with'],
    },

    number: {
      criteria: ['eq', 'neq', 'lt', 'gt', 'lte', 'gte'],
    },

    select: {
      criteria: ['is', 'is_not'],
    },
  },
};

window.gridCompFilterConfig = filterConfig;
