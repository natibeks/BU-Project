//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MoviesLibrary.App_Code
{
    using System;
    using System.Collections.Generic;
    
    public partial class Movie
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Plot { get; set; }
        public int Genre { get; set; }
        public int Year { get; set; }
        public int Director { get; set; }
        public Nullable<int> WhoRent { get; set; }
        public Nullable<bool> IsArchive { get; set; }
    }
}