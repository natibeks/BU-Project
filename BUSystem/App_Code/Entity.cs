﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;

public partial class Category
{
    public int Id { get; set; }
    public string CategoryName { get; set; }
    public int DomainID { get; set; }
}

public partial class Department
{
    public int Id { get; set; }
    public string DepartmentName { get; set; }
}

public partial class Domain
{
    public int Id { get; set; }
    public string DomainName { get; set; }
}

public partial class Location
{
    public int Id { get; set; }
    public string Building { get; set; }
    public Nullable<int> Room { get; set; }
    public string Description { get; set; }
    public Nullable<bool> IsArchive { get; set; }
}

public partial class Role
{
    public int Id { get; set; }
    public string Role1 { get; set; }
}

public partial class Status
{
    public int Id { get; set; }
    public string StatusName { get; set; }
}

public partial class Task
{
    public int Id { get; set; }
    public int TicketID { get; set; }
    public string TaskDescription { get; set; }
    public Nullable<bool> Done { get; set; }
    public Nullable<bool> IsArchive { get; set; }
}

public partial class Ticket
{
    public int Id { get; set; }
    public int CategoryID { get; set; }
    public Nullable<int> LocationID { get; set; }
    public bool Priority { get; set; }
    public string Description { get; set; }
    public int Status { get; set; }
    public Nullable<System.DateTime> TimeOpen { get; set; }
    public Nullable<System.DateTime> TimeClose { get; set; }
    public Nullable<bool> IsArchive { get; set; }
}

public partial class User
{
    public int Id { get; set; }
    public string DisplayName { get; set; }
    public string EmailAddress { get; set; }
    public string TelephoneNumber { get; set; }
    public string UserPassword { get; set; }
    public Nullable<bool> LoginStatus { get; set; }
    public Nullable<int> Role { get; set; }
    public Nullable<bool> IsArchive { get; set; }
    public Nullable<int> Department { get; set; }
}

public partial class UserDomain
{
    public int UserID { get; set; }
    public int DomainID { get; set; }
    public Nullable<bool> IsArchive { get; set; }
}

public partial class UserTicket
{
    public int UserID { get; set; }
    public int TicketID { get; set; }
    public Nullable<bool> MainUser { get; set; }
    public Nullable<bool> IsArchive { get; set; }
}

public partial class spGetData_Result
{
    public string uid { get; set; }
    public string DisplayName { get; set; }
    public string EmailAddress { get; set; }
    public string TelephoneNumber { get; set; }
    public string Department { get; set; }
    public string UserPassword { get; set; }
    public bool LoginStatus { get; set; }
    public int Role { get; set; }
}
