namespace Co.Cukcuk.Api.Entities
{
    public class Position
    {
        public Guid PositionID { get; set; }

        public string PositionCode { get; set; }

        public string PositionName { get; set; }

        public DateTime CreatedTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
