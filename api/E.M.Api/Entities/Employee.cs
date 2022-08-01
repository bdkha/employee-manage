using Co.Cukcuk.Api.Enum;
using System.ComponentModel.DataAnnotations;

namespace Co.Cukcuk.Api.Entity
{
    /// <summary>
    /// Nhân viên 
    /// </summary>
    public class Employee
    {
        /// <summary>
        /// ID Nhân viên
        /// </summary>
        public Guid? EmployeeID { get; set; }

        /// <summary>
        /// Mã nhân viên
        /// </summary>
        [Required(ErrorMessage= "e004")]
        public string EmployeeCode { get; set; }

        /// <summary>
        /// Tên nhân viên  
        /// </summary>
        [Required(ErrorMessage = "e005")]
        public string EmployeeName { get; set; }

        /// <summary>
        /// Ngày sinh 
        /// </summary>
        public DateTime? DateOfBirth { get; set; }


        /// <summary>
        /// Giới tính 
        /// </summary>
        public int? Gender { get; set; }


        /// <summary>
        /// Số CMND/CCCD 
        /// </summary>
        [Required(ErrorMessage = "e006")]
        public string IndentityNumber { get; set; }


        /// <summary>
        /// Nơi cấp CMND/CCCD 
        /// </summary>
        public string? IndentityIssuedPlace { get; set; }

        /// <summary>
        /// Ngày cấp CMND/CCCD 
        /// </summary>
        public DateTime? IndentityIssuedDate { get; set; }


        /// <summary>
        /// Email
        /// </summary>
        
        [Required(ErrorMessage = "e007")]
        [EmailAddress(ErrorMessage = "e009")]
        public string Email { get; set; }

        /// <summary>
        /// Số điện thoại
        /// </summary>
        [Required(ErrorMessage = "e008")]
        public string PhoneNumber { get; set; }

        /// <summary>
        /// ID vi tri cong viec
        /// </summary>
        public Guid? PositionID { get; set; }

        /// <summary>
        /// Tên vị trí công việc
        /// </summary>
        public string? PositionName { get; set; }

        /// <summary>
        /// ID phong ban
        /// </summary>
        public Guid? DepartmentID { get; set; }

        /// <summary>
        /// Tên phòng ban
        /// </summary>
        /// 
        public string? DepartmentName { get; set; }

        /// <summary>
        /// Mã số thuế
        /// </summary>
        public string TaxCode { get; set; }

        /// <summary>
        /// Lương cơ bản
        /// </summary>
        public double? Salary { get; set; }

        /// <summary>
        /// Ngày gia nhập công ty
        /// </summary>
        public DateTime? JoiningDate { get; set; }

        /// <summary>
        /// Trạng thái làm việc
        /// </summary>
        public int? WorkStatus { get; set; }

        /// <summary>
        /// Ngày tạo
        /// </summary>
        public DateTime? CreatedDate { get; set; }

        /// <summary>
        /// Người tạo
        /// </summary>
        public string? CreatedBy { get; set; }

        /// <summary>
        /// Ngày sửa
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// Người sửa
        /// </summary>
        public string? ModifiedBy { get; set; }

    }
}
