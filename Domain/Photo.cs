namespace Domain
{
    public class Photo
    {
        //properties
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; } //if photo is main photo for user
    }
}