using Co.Cukcuk.Api.Entity;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Swashbuckle.AspNetCore.Annotations;

namespace Co.Cukcuk.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        /// <summary>
        /// API Thêm mới 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên muốn thêm mới</param>
        /// <returns>ID của nhân viên vừa thêm mới</returns>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, type: typeof(Guid))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult InseartEmployee([FromBody] Employee employee)
        {
            try
            {

                string connectString = "//search connect string to your database ;";
                var mySqlConnection = new MySqlConnection(connectString);

                string insertCommand = "INSERT INTO employee (EmployeeID, EmployeeCode, EmployeeName, DateOfBirth, " +
                    "Gender, IdentityNumber, IdentityIssuedPlace, IdentityIssuedDate, Email, PhoneNumber, PositionID," +
                    " DepartmentID, TaxCode, Salary, JoiningDate, WorkStatus, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy)" +
                    "VALUES(@EmployeeID, @EmployeeCode, @EmployeeName, @DateOfBirth, " +
                    "@Gender, @IndentityNumber, @IdentityIssuedPlace, @IdentityIssuedDate, @Email, @PhoneNumber, @PositionID," +
                    " @DepartmentID, @TaxCode, @Salary, @JoiningDate, @WorkStatus, @CreatedDate, @CreatedBy, @ModifiedDate, @ModifiedBy)";

                var dateTimeNow = DateTime.Now;
                var employeeID = Guid.NewGuid();
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeID", employeeID);
                parameters.Add("@EmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@DateOfBirth", employee.DateOfBirth);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@IndentityNumber", employee.IndentityNumber);
                parameters.Add("@IndentityIssuedPlace", employee.IndentityIssuedPlace);
                parameters.Add("@IndentityIssuedDate", employee.IndentityIssuedDate);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);
                parameters.Add("@PositionID", employee.PositionID);
                parameters.Add("@DepartmentID", employee.DepartmentID);
                parameters.Add("@TaxCode", employee.TaxCode);
                parameters.Add("@Salary", employee.Salary);
                parameters.Add("@JoiningDate", employee.JoiningDate);
                parameters.Add("@WorkStatus", employee.WorkStatus);
                parameters.Add("@CreatedDate", dateTimeNow);
                parameters.Add("@CreatedBy", employee.CreatedBy);
                parameters.Add("@ModifiedDate", dateTimeNow);
                parameters.Add("@ModifiedBy", employee.ModifiedBy);


                var affectRows = mySqlConnection.Execute(insertCommand, parameters);

                if (affectRows > 0)
                {
                    return StatusCode(StatusCodes.Status201Created, employeeID);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }

            }

            catch (MySqlException exception)
            {
                if (exception.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }
                return StatusCode(StatusCodes.Status400BadRequest, exception.ToString());
            }
            catch (Exception exeption)
            {

                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }

        }

        /// <summary>
        /// Sua thong tin 1 nhan vien
        /// </summary>
        /// <param name="employeeID">ID nhan vien</param>
        /// <param name="employee">Doi tuong nhan vien</param>
        /// <returns>ID nhan vien</returns>
        [HttpPut("{employeeID}")]
        public IActionResult UpdateEmployee([FromRoute] Guid employeeID, [FromBody] Employee employee)
        {
            try
            {
                string connectionString = "//search connect string to your database ;";
                var mySqlConnection = new MySqlConnection(connectionString);
                string updateCommand = "UPDATE employee " +
                    "SET EmployeeCode = @EmployeeCode, " +
                    "EmployeeName = @EmployeeName, " +
                    "DateOfBirth = @DateOfBirth, " +
                    "Gender = @Gender, " +
                    "IdentityNumber = @IndentityNumber, " +
                    "IdentityIssuedPlace = @IdentityIssuedPlace, " +
                    "IdentityIssuedDate = @IdentityIssuedDate, " +
                    "Email = @Email, " +
                    "PhoneNumber = @PhoneNumber, " +
                    "PositionID = @PositionID, " +
                    "DepartmentID = @DepartmentID, " +
                    "TaxCode = @TaxCode, " +
                    "Salary = @Salary, " +
                    "JoiningDate = @JoiningDate, " +
                    "WorkStatus = @WorkStatus, " +
                    "ModifiedDate = @ModifiedDate, " +
                    "ModifiedBy = @ModifiedBy " +
                    "WHERE EmployeeID = @EmployeeID;";
                var dateTimeNow = DateTime.Now;
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeID", employeeID);
                parameters.Add("@EmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@DateOfBirth", employee.DateOfBirth);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@IndentityNumber", employee.IndentityNumber);
                parameters.Add("@IndentityIssuedPlace", employee.IndentityIssuedPlace);
                parameters.Add("@IndentityIssuedDate", employee.IndentityIssuedDate);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);
                parameters.Add("@PositionID", employee.PositionID);
                parameters.Add("@DepartmentID", employee.DepartmentID);
                parameters.Add("@TaxCode", employee.TaxCode);
                parameters.Add("@Salary", employee.Salary);
                parameters.Add("@JoiningDate", employee.JoiningDate);
                parameters.Add("@WorkStatus", employee.WorkStatus);
                parameters.Add("@ModifiedDate", dateTimeNow);
                parameters.Add("@ModifiedBy", employee.ModifiedBy);

                var numberOfAffectRows = mySqlConnection.Execute(updateCommand, parameters);

                if (numberOfAffectRows > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, employeeID);
                }

                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }

            }
            catch (MySqlException mysqlException)
            {
                if (mysqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }
                return StatusCode(StatusCodes.Status400BadRequest, "e002");

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Xóa 1 nhân viên
        /// </summary>
        /// <param name="employeeID">ID của nhân viên muốn xóa</param>
        /// <returns>ID của nhân viên vừa xóa</returns>
        [HttpDelete("{employeeID}")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(Guid))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteEmployeeByID([FromRoute]Guid employeeID)
        {
            try

            {
                string connectString = "//search connect string to your database ;";
                var mySqlConnection = new MySqlConnection(connectString);
                string deleteCommand = "DELETE FROM employee WHERE employeeID = @EmployeeID";
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeID", employeeID);
                var numberOfAffectRows = mySqlConnection.Execute(deleteCommand, parameters);

                if (numberOfAffectRows > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, employeeID);
                }

                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }

            catch (MySqlException mysqlException)
            {
                if (mysqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }
                return StatusCode(StatusCodes.Status400BadRequest, "e001");

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Lấy danh sách nhân viên cho phép lọc và phân trang
        /// </summary>
        /// <param name="code">Mã nhân viên</param>
        /// <param name="name">Tên nhân viên</param>
        /// <param name="phoneNumber">Số điện thoại</param>
        /// <param name="positionID">ID vị trí</param>
        /// <param name="departmentID">ID phòng ban</param>
        /// <param name="pageSize">Số trang muốn lấy</param>
        /// <param name="pageNumber">Thứ tự trang muốn lấy</param>
        /// <returns>Một đối tượng gồm:
        /// + Danh sách nhân viên thỏa mãn điều kiện lọc và phân trang
        /// + Tổng số nhân viên thỏa mãn điều kiện</returns>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(PagingData<Employee>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult FilterEmployees([FromQuery]string? code, [FromQuery]string? name, [FromQuery]string? phoneNumber,
            [FromQuery]Guid? positionID, [FromQuery]Guid? departmentID, [FromQuery]int pageSize = 10, [FromQuery]int pageNumber = 1)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "//search connect string to your database ;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Employee_GetPaging";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$Skip", (pageNumber - 1) * pageSize);
                parameters.Add("@$Take", pageSize);
                parameters.Add("@$Sort", "ModifiedDate DESC");

                var whereConditions = new List<string>();
                if (code != null)
                {
                    whereConditions.Add($"EmployeeCode LIKE '%{code}%'");
                }
                if (name != null)
                {
                    whereConditions.Add($"EmployeeName LIKE '%{name}%'");
                }
                if (phoneNumber != null)
                {
                    whereConditions.Add($"PhoneNumber LIKE '%{phoneNumber}%'");
                }
                string whereClause = string.Join(" OR ", whereConditions);
                whereConditions.Clear();
                if (whereClause != "")
                {
                    whereClause = "( " + whereClause + " )";
                    whereConditions.Add(whereClause);
                    whereClause = null;
                }
                if (positionID != null)
                {
                    whereConditions.Add($"PositionID LIKE '%{positionID}%'");
                }
                if (departmentID != null)
                {
                    whereConditions.Add($"DepartmentID LIKE '%{departmentID}%'");
                }
                whereClause = string.Join(" AND ", whereConditions);
                             
                parameters.Add("@$Where", whereClause);



                var multipleResults = mySqlConnection.QueryMultiple(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                if (multipleResults != null)
                {

                    var employees = multipleResults.Read<Employee>();
                    var totalCount = multipleResults.Read<long>().Single();
                    return StatusCode(StatusCodes.Status200OK, new PagingData<Employee>()
                    {
                        Data = employees.ToList(),
                        TotalCount = totalCount
                    });
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, exception);
            }
        }

        /// <summary>
        /// API Lấy thông tin chi tiết của 1 nhân viên
        /// </summary>
        /// <param name="employeeCode">Mã của nhân viên muốn lấy thông tin chi tiết</param>
        /// <returns>Đối tượng nhân viên muốn lấy thông tin chi tiết</returns>
        [HttpGet("{employeeID}")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(Employee))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult GetEmployeeByCode([FromRoute] string employeeCode)
        {
            try

            {
                string connectionString = "//search connect string to your database ;";
                var mySqlConnection = new MySqlConnection(connectionString);

                string storedProcedureName = "Proc_Employee_GetByEmployeeCode";

                var parameters = new DynamicParameters();
                parameters.Add("@$EmployeeCode", employeeCode);

                var employee = mySqlConnection.QueryFirstOrDefault<Employee>(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                if (employee != null)
                {
                    return StatusCode(StatusCodes.Status200OK, employee);
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound);
                }
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Lấy mã nhân viên mới tự động tăng
        /// </summary>
        /// <returns>Mã nhân viên mới tự động tăng</returns>
        [HttpGet("new-code")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(string))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult GetNewEmployeeCode()
        {
            string connectionString = "//search connect string to your database ;";
            var mySqlConnection = new MySqlConnection(connectionString);

            string storedProcedureName = "Proc_Employee_GetMaxCode";

            string maxEmployeeCode = mySqlConnection.QueryFirstOrDefault<string>(storedProcedureName, commandType: System.Data.CommandType.StoredProcedure);

            // Xử lý sinh mã nhân viên mới tự động tăng
            // Cắt chuỗi mã nhân viên lớn nhất trong hệ thống để lấy phần số
            // Mã nhân viên mới = "NV" + Giá trị cắt chuỗi ở  trên + 1
            string newEmployeeCode = "NV" + (Int64.Parse(maxEmployeeCode[2..]) + 1).ToString();
            var newCode = new string[] { newEmployeeCode };

            return StatusCode(StatusCodes.Status200OK, newCode);
        }


    }
}
