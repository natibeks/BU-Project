var AppMenu = [{//admin
    UserType: 0,
    PageTitle: "main",
    Menu: [{ id: 1, Title: "דוחות", type: 'def' }, { id: 2, Title: "ניהול משתמשים", type: 'def' }]
}, {//user
    UserType: 1,
    PageTitle: "main",
    Menu: []
}, {//employee
    UserType: 2,
    PageTitle: "main",
    Menu: []
},
{//manager
    UserType: 3,
    PageTitle: "main",
    Menu: [{ id: 1, Title: "דוחות", type: 'def' }]
},
{//chief
    UserType: 4,
    PageTitle: "main",
    Menu: [{ id: 1, Title: "דוחות", type: 'def' }]
}
]

var PageConfig = [
    {
        Id: 1,
        Name: 'MyTicket',
        Table: [
            {
                Label: "תאריך פתיחה",
                Width: "150px",
                Data: "TimeOpen",
            }, {
                Label: "קטגוריה",
                Width: "150px",
                Data: "Category",
            }, {
                Label: "תיאור קצר",
                Width: "auto",
                Data: "Description",
            }, {
                Label: "סטטוס",
                Width: "150px",
                Data: "Status",
            },
        ]

    },
    {
        Id: 2,
        Name: 'ticketToDo',
        Table: [
            {
                Label: "תאריך פתיחה",
                Width: "150px",
                Data: "TimeClose",
            }, {
                Label: "שם הפונה",
                Width: "150px",
                Data: "DisplayName",
            }, {
                Label: "קטגוריה",
                Width: "150px",
                Data: "Category",
            }, {
                Label: "תיאור קצר",
                Width: "auto",
                Data: "Description",
            }, {
                Label: "סטטוס",
                Width: "150px",
                Data: "Status",
            }
        ]

    },
    {
        Id: 3,
        Name: 'Search',
        Table: [
            {
                Label: "תיאור קצר",
                Width: "auto",
                Data: "Description",
            }, {
                Label: "קטגוריה",
                Width: "150px",
                Data: "CategoryName",
            },
            {
                Label: "סטטוס",
                Width: "150px",
                Data: "Status",
            },
        ]

    },
    {
        Id: 0,
        Name: 'ManageUsers',
        Table: [
            {
                Label: "שם",
                Width: "300px",
                Data: "DisplayName",
            }, {
                Label: "אימייל",
                Width: "150px",
                Data: "EmailAddress",
            },
            {
                Label: "טלפון",
                Width: "150px",
                Data: "TelephoneNumber",
            },
            {
                Label: "מחלקה",
                Width: "150px",
                Data: "Department",
            },
        ]

    },
    {
        Id: 4,
        Name: 'Tasks',
        Table: [
            {
                Label: "תיאור",
                Width: "auto",
                Data: "TaskDescription",
            }, {
                Label: "בוצע",
                Width: "60px",
                Data: "Done",
            }
        ]

    }
]