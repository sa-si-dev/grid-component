const gridsConfig = {
  sampleGrid: {
    title: 'This is a sample grid',
    columns: [
      {
        id: 'ssn',
        name: 'SSN',
        key: 'ssn',
        width: '100px',
        sticky: true,
        filter: {},
      },
      {
        id: 'firstName',
        name: 'First Name',
        key: 'first_name',
        width: '150px',
        alwaysShow: true,
        filter: {},
      },
      {
        id: 'lastName',
        name: 'Last Name',
        resizable: false,
        width: '150px',
        key: 'last_name',
        filter: {},
      },
      {
        id: 'country',
        name: 'Country',
        key: 'country',
        width: '200px',
        filter: {
          type: 'select',
          key: 'countryCode',
          multiple: true,
          options: 'getCountryOptions',
        },
      },
      {
        id: 'longCol',
        name: 'A long text column to check that how a long text will be displayed.',
        key: 'longCol',
        filter: {},
      },
      {
        id: 'phone',
        name: 'Phone',
        key: 'phone',
        filter: {
          type: 'select',
          criteria: ['is'],
          options: 'getPhoneOptions',
        },
      },
      {
        id: 'zip',
        name: 'ZIP',
        key: 'zip',
        width: '100px',
        filter: {
          type: 'number',
        },
      },
      {
        id: 'email',
        name: 'Email ID',
        key: 'email',
        width: '250px',
        renderer: 'rendererEmailCol',
        sortable: false,
        filter: {},
      },
      {
        id: 'amount',
        name: 'Purchase amount',
        width: '150px',
        key: 'amountText',
        align: 'right',
        filter: {
          key: 'amount',
          type: 'number',
          allowDecimal: true,
        },
      },
      {
        id: 'hiddenCol',
        hidden: true,
        name: 'A hidden column',
        key: 'hiddenCol',
        filter: {
          renderer: 'rendererHiddenCol1Filter',
        },
      },
    ],
  },
};
