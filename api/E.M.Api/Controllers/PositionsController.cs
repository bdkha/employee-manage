using Co.Cukcuk.Api.Entities;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Swashbuckle.AspNetCore.Annotations;

namespace Co.Cukcuk.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {

        /// <summary>
        /// API Lấy toàn bộ danh sách vị trí
        /// </summary>
        /// <returns>Danh sách vị trí</returns>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(List<Position>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult getAllPositions()
        {
            try
            {
                string connectString = "//search connect string to your database ;";
                var mySqlConnection = new MySqlConnection(connectString);

                string getAllPositionCommand = "SELECT * FROM positions;";
                var positions = mySqlConnection.Query<Position>(getAllPositionCommand);
                if (positions != null)
                {
                    return StatusCode(StatusCodes.Status200OK, positions);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
    }
}
