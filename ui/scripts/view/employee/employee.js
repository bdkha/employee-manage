class EmployeePage {
  // ham khoi tao
  constructor(gridID) {
    let me = this;
    me.grid = $(`${gridID}`);
    me.pageNumber = 1;
    me.pageSize = 20;
    me.filterText = "";
    me.departmentID = "";
    me.positionID = "";
    me.initEvents();
    me.getData();
    me.initForm();
    me.initPopup();
    me.initSelectFilter();
  }

  /**
   * @description: hàm khởi tạo sự kiện trên trang
   */
  initEvents() {
      let me = this;
      me.initEventToolbar();
      me.initEventFilter();
      me.initEventSelectRow();
      me.initFilterEvents();
      me.initPageNavigationEvents();
  }

  /**
   * @description: hàm khởi tạo sự kiện cho thanh page navigation
   */
  initPageNavigationEvents() {
    let me = this;
    $("#page-size").on("change", function () {
      me.pageSize = $(this).val();
      me.refresh();
    });
  }

  /**
   * @description: hàm khởi tạo sự kiện cho thanh filter
   */
  initFilterEvents() {
    let me = this;
    $("#text-filter").on("keyup", function () {
      me.filterText = $(this).val();
    });
    $("#department-select").change(function () {
      me.departmentID = $(this).val();
      me.refresh();
    });
    $("#position-select").change(function () {
      me.positionID = $(this).val();
      me.refresh();
    });
    $("#text-filter").on("keypress", function (e) {
      if (e.keyCode == 13) {
        me.refresh();
      }
    })
    $("#text-filter").focusout(function () {
      me.refresh();
    });
  }

  /**
   * @description: khởi tạo select vị trí công việc và phòng ban
   */
  initSelectFilter() {
    let me = this;
    me.initDepartmentSelect();
    me.initPositionSelect();
  }

  /**
   * @description: hàm khởi tạo thanh select vị trí công việc cho thanh filter
   */
  initPositionSelect(){
    let me = this,
        control = $("#position-select");
    //lấy dữ liệu vị trí công việc
    CommonFn.Ajax('http://localhost:59811/api/v1/Positions', Resource.Method.Get, {}, function (response) {
        response.forEach(function(item){
            control.append($('<option>', {
                value: item.positionID, //ID vị trí công việc
                text: item.positionName //Tên vị trí công việc
            }))
        })
    })
  }

  /**
   * @description: hàm khởi tạo thanh select phòng ban cho thanh filter
   */
  initDepartmentSelect(){
      let me = this,
          control = $("#department-select");
      //lấy dữ liệu phòng ban
      CommonFn.Ajax('http://localhost:59811/api/v1/Departments', Resource.Method.Get, {}, function (response) {
          response.forEach(function(item){
              control.append($('<option>', {
                  value: item.departmentID,  //ID phòng ban
                  text: item.departmentName  //Tên phòng ban
              }))
          })
      })
  }

  /**
   * @description: hàm khởi tạo sự kiện cho các hàng trong bảng
   */
  initEventSelectRow(){
    let me = this;

    // Khởi tạo sự kiện khi chọn các dòng khác nhau
    me.grid.off("click", "tr");
    me.grid.on("click","tr", function(){
        let row = $(this);
        if(row.hasClass("selected-row")){
            row.removeClass("selected-row");
        } else {
        me.grid.find(".selected-row").removeClass("selected-row");

        $(this).addClass("selected-row");
        }
    });
    // Khởi tạo sự kiện khi doubleclick các dòng khác nhau
    me.grid.off("dblclick", "tr");
    me.grid.on("dblclick","tr", function(){
      me.grid.find(".selected-row").removeClass("selected-row");

        $(this).addClass("selected-row");
        me.edit();
    });
  }

  /**
   * @description: hàm xóa trạng thái được chọn cho hàng đang được chọn
   */
  removeSelectedRow() {
    let me = this;
    me.grid.find(".selected-row").removeClass("selected-row");
  }

  /**
   * @description: hàm lấy dữ liệu hàng đang được chọn
   * @returns {data} dữ liệu hàng đang được chọn
   */
  getSelectedRecord(){
    let me = this,
        data = me.grid.find(".selected-row").eq(0).data("data");
    return data;
  }

  /**
   * @description: kiểm tra xem có hàng nào đang được chọn hay không
   * @returns {boolean} true nếu có hàng đang được chọn, false nếu không
   */
  isSelectedRow() {
    let me = this;
    return me.grid.find(".selected-row").length > 0;
  }

  /**
   * @description: hàm khởi tạo sự kiện cho thanh chức năng
   */
  initEventToolbar() {
    let me = this,
      toolBarID = me.grid.attr("ToolBar");

      $(`#${toolBarID} [CommandType]`).off("click");
      $(`#${toolBarID} [CommandType]`).on("click", function(){
          let commandType = $(this).attr("CommandType");
          // Gọi đến hàm động cách 2
          if(me[commandType] && typeof me[commandType] == "function"){
              me[commandType]();
          }
        });
  }

  /**
   * @description: hàm khởi tạo sự kiện cho thanh filter
   */
  initEventFilter() {
    let me = this,
      filterID = me.grid.attr("Filter");
    $(`#${filterID}`).find("#text-filter").on("keyup", function () {
      me.filterText = $(this).val();
    });
    $(`#${filterID}`).find("#department-select").change(function () {
      me.departmentID = $(this).val();
    });
    $(`#${filterID}`).find("#position-select").change(function () {
      me.positionID = $(this).val();
    });
  }

  /**
   * @description: hàm khởi tạo form thông tin nhân viên
   */
  initForm() {
    let me = this;
    me.formEmployee= new EmployeeForm("form-add-employee");
  }

  /**
   * @description: hàm khởi tạo popup xóa nhân viên
   */
  initPopup() {
    let me = this;
    me.popup = new PopUp("delete-popup");
  }

  /**
   * @description: thực hiện các hành động khi click vào nút thêm nhân viên
   */
  add() {
    let me = this,
      param = {
        Parent: this,
        FormMode: Resource.FormMode.Add,
        Record: {}
      };
    //kiểm tra xem form đã được khởi tạo hay chưa

    if (me.formEmployee) {
      me.formEmployee.open(param);
    }
  }

  /**
   * @description: thực hiện các hành động khi doubleclick vào nhân viên
   */
  edit(){
    let me = this,
        param = {
            Parent: this,
            FormMode: Resource.FormMode.Edit,
            ItemId: me.ItemId,
            Record: {...me.getSelectedRecord()}
        };

    // Nếu có form detail thì show form
    if(me.formEmployee){
        me.formEmployee.open(param);
    }
  }

  /**
   * @description: thực hiện các hành động khi click vào nút làm mới
   */
  refresh() {
    let me = this;
    $("#numbers-of-employee").empty();
    me.grid.find(".table-frame").remove();
    let tempGrid = $('<div class="table-frame">'
    + '<div class="col" FieldName="employeeCode">Mã nhân viên</div>'
    + '<div class="col" FieldName="employeeName">Tên nhân viên</div>'
    + '<div class="col" FieldName="gender">Giới tính</div>'
    + '<div class="col" FieldName="dateOfBirth" DataType="Date">'
    + '    Ngày sinh'
    + '</div>'
    + '<div class="col" FieldName="phoneNumber">Điện thoại</div>'
    + '<div class="col" FieldName="email">Email</div>'
    + '<div class="col" FieldName="positionName">Chức vụ</div>'
    + '<div class="col" FieldName="departmentName">Phòng ban</div>'
    + '<div class="col" FieldName="salary" DataType="Currency">'
    + '    Mức lương cơ bản'
    + '</div>'
    + '<div class="col" FieldName="WorkingStatus">Tình trạng công việc</div>'
    +'</div>');
    me.grid.append(tempGrid);
    me.getData();
  }

  /**
   * @description: thực hiện các hành động khi click vào nút xóa nhân viên
   */
  delete(){
    let me = this,
        param = {
            Parent: this,
            ItemId: me.ItemId,
            Record: {...me.getSelectedRecord()}
        };
    if (me.popup && me.isSelectedRow()) {
      me.popup.open(param);
    }
  }

  /**
   * @description: thực hiện các hành động khi click vào nút nhân bản
   */
  duplicate() {
    let me = this,
      param = {
        Parent: this, 
        FormMode: Resource.FormMode.Duplicate,
        Record: {...me.getSelectedRecord()}
      };
    if (me.formEmployee && me.isSelectedRow()) {
      me.formEmployee.open(param);
    }

  }

  
  /**
   * lấy dữ liệu nhân viên từ server
   */
  getData() {
    let me = this,
      url = me.grid.attr("Url");
    url = url + "?pageNumber=" + me.pageNumber + "&pageSize=" + me.pageSize;
    if (me.filterText !== "") {
      url = url + "&code=" + me.filterText + "&name=" + me.filterText + "&phoneNumber=" + me.filterText;
    }
    if (me.departmentID !== "") {
      url = url + "&departmentID=" + me.departmentID;
    }
    if (me.positionID !== "") {
      url = url + "&positionID=" + me.positionID;
    }
    CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
      if (response.totalCount > 0) {
        console.log(response);
        me.renderGridData(response);
      } else {
        me.renderEmptyData();
      }
    })
  };

  /**
   * @description: hàm render thông báo không có dữ liệu
   */
  renderEmptyData() {
    let me = this,
      div = $('<div></div>');
      $("#pageNavigation").hide();
      div.addClass("none-data");
      div.text("Không có kết quả phù hợp");
      me.grid.html(div);
  }

  /**
   * @description: hàm render dữ liệu nhân viên lên bảng
   * @param {*} data dữ liệu nhân viên
   */
  renderGridData(data) {
    let me = this,
      table = $("<table></table>"),
      thead = me.renderThead(),
      tbody = me.renderTbody(data);
     
    table.append(thead);
    table.append(tbody);
    me.grid.html(table);
    me.renderPageNavigation(data.totalCount);

  }

  /**
   * @description: hàm render thanh phân trang
   * @param {*} data tổng số bản hợp lệ trong database
   */
  renderPageNavigation(data) {
    let me = this,
      number_of_employee = $(`<p>Hiển thị ${(me.pageNumber - 1) * me.pageSize + 1}-${me.pageNumber * me.pageSize}/${data} nhân viên</p>`);
    $("#numbers-of-employee").append(number_of_employee);
    $("#pageNavigation").show();
  }

  /**
   * @description: hàm render header của bảng
   * @returns {HTMLTableSectionElement} header của bảng nhân viên
   */
  renderThead() {
    let me = this,
      thead = $("<thead></thead>"),
      tr = $("<tr></tr>");

    me.grid.find(".col").each(function(){
      let text = $(this).text(),
          dataType = $(this).attr("DataType"),
          className = me.getClassFormat(dataType),
          th = $("<th></th>");
      th.text(text);
      th.addClass(className);
      tr.append(th);
    })
    thead.append(tr);
    return thead;
  }

  /**
   * @description: hàm render body của bảng
   * @param {*} data dữ liệu nhân viên từ server
   * @returns body của bảng nhân viên
   */
  renderTbody(data) {
    let me = this,
      tbody = $("<tbody></tbody>");
    if (data.totalCount > 0) {
      data.data.filter(function(item) {
        let tr = $("<tr></tr>");
        me.grid.find(".col").each(function(){
          let fieldName = $(this).attr("FieldName"),
              dataType = $(this).attr("DataType"),
              className = me.getClassFormat(dataType),
              td = $("<td></td>"),
              value = me.getValue(item, fieldName, dataType );	
          td.text(value);
          td.addClass(className);
          tr.append(td);
          tr.data("data", item);
          tbody.append(tr);
          
        })
      })
    }
    return tbody;
  }

  /**
   * @description: hàm lấy giá trị của thuộc tính của nhân viên
   * @param {*} item dữ liệu 1 nhân viên
   * @param {*} fieldName tên của trường dữ liệu
   * @param {*} dataType kiểu dữ liệu
   * @returns dữ liệu của trường dữ liệu đã được format
   */
  getValue(item, fieldName, dataType) {
    let value = item[fieldName];
    if (fieldName == "gender") {
      switch (value) {
        case 0:
          return Resource.Gender.Female;
          break;
        case 1:
          return Resource.Gender.Male;
          break;
        case 2:
          return Resource.Gender.Other;
      }
    }
    if (fieldName == "workStatus") {
      switch (value) {
        case 0:
          return Resource.WorkStatus.Working;
        case 1: 
          return Resource.WorkStatus.NotWorking;
        case 2:
          return Resource.WorkStatus.Leave;
        case 3: 
          return Resource.WorkStatus.Resign;

      }
    }
    if (!value) {
      return;
    }
    switch (dataType) {
      case Resource.DataTypeColumn.Date:
        return CommonFn.formatDate(value);
      case Resource.DataTypeColumn.Currency:
        return CommonFn.formatMoney(value);
      
      default:
        return value;
    }
  }

  /**
   * @description: hàm lấy class của thuộc tính của nhân viên
   * @param {*} dataType kiểu dữ liệu
   * @returns class của thẻ td
   */
  getClassFormat(dataType) {
    let className = "";
    
    switch(dataType){
        case Resource.DataTypeColumn.Currency:
            className = "align-right";
            break;
        case Resource.DataTypeColumn.Date:
            className = "align-center";
            break;
    }

    return className;
  }


}

var employeePage = new EmployeePage("#grid-employee");
