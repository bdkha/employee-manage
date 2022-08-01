class EmployeeForm {
    constructor(formId){
        let me = this;

        me.form = $(`#${formId}`);
        me.mode = null;
        // Khởi tạo sự kiện cho form
        me.initEvents();
        me.initSelected();
    }

    /**
     * @description: Khởi tạo sự kiện cho form
     */
    initEvents(){
        let me = this;

        // Khởi tạo sự kiện button trên thanh hành động
        me.form.find("[CommandType]").off("click");
        me.form.find("[CommandType]").on("click", function(){
            let commandType = $(this).attr("CommandType");

            // Gọi đến hàm động 
            if(me[commandType] && typeof me[commandType] == "function"){
                me[commandType]();
            }
        });
        me.initAvatarEvent();
    }

    /**
     * @description: đọc file từ url
     * @param {*} input input file
     */
    readUrl(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var fileUrl = e.target.result;
                $(".profile-pic").attr('src',   fileUrl);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    /**
     * @description: khởi tạo sự kiện cho avatar
     */
    initAvatarEvent() {
        let me = this;
        $(".file-upload").on('change', function() {
            $(".upload-button").on("click");
            me.readUrl(this);
        });
        $(".upload-button").click(function (e) { 
            e.stopPropagation();
            console.log("click");
            $(".upload-button").off("click");
            $(".file-upload").click();
            
        });
    }   

    /**
     * @description: tạo thanh select trong form
     */
    initSelected(){
        let me = this;

        me.initGenderSelect();
        me.initPositionSelect();
        me.initDepartmentSelect();
        me.initWorkStatusSelect();
    }

    /**
     * @description: tạo thanh select giới tính
     */
    initGenderSelect(){
        let me = this,
            control = me.form.find("#gender");
        control.append($('<option>', {
                value: '0',
                text: Resource.Gender.Female
        }))
        control.append($('<option>', {
            value: '1',
            text: Resource.Gender.Male
        }))
        control.append($('<option>', {
            value: '2',
            text: Resource.Gender.Other
        }))
       

    }

    /**
     * @description: tạo thanh select chức vụ
     */
    initPositionSelect(){
        let me = this,
            control = me.form.find("#position");
        CommonFn.Ajax('http://localhost:59811/api/v1/Positions', Resource.Method.Get, {}, function (response) {
            response.forEach(function(item){
                control.append($('<option>', {
                    value: item.positionID,
                    text: item.positionName
                }))
            })
        })
    }

    /**
     * @description: tạo thanh select phòng ban
     */
    initDepartmentSelect(){
        let me = this,
            control = me.form.find("#department");
        CommonFn.Ajax('http://localhost:59811/api/v1/Departments', Resource.Method.Get, {}, function (response) {
            response.forEach(function(item){
                control.append($('<option>', {
                    value: item.departmentID,
                    text: item.departmentName
                }))
            })
        })
    }

    /**
     * @description: tạo thanh select trạng thái công việc
     */
    initWorkStatusSelect(){
        let me = this,
            control = me.form.find("#work-status");
        control.append($('<option>', {
            value: '0',
            text: Resource.WorkStatus.Working
        }))
        control.append($('<option>', {
            value: '1',
            text: Resource.WorkStatus.NotWorking
        }))
        control.append($('<option>', {
            value: '2',
            text: Resource.WorkStatus.Leave
        }))
        control.append($('<option>', {
            value: '3',
            text: Resource.WorkStatus.Resign
        }))

    }

    /**
     * @description: hành động mở form
     * @param {*} param dữ liệu được truyển từ bảng và thanh hành động
     */
    open(param) {
        let me = this;
        Object.assign(me, param);
        me.form.fadeIn(300);
        $(".overplay").fadeIn(300);
        if (param.FormMode == Resource.FormMode.Edit || param.FormMode == Resource.FormMode.Duplicate) {
         
            me.bindingData(me.Record, param.FormMode);
        } else {
            me.resetForm();
            me.getNewId();

        }
        $("#employee-code").focus();
    }

    /**
     * @description: binding dữ liệu ra form
     * @param {} data dữ liệu bản ghi
     * @param {*} formMode chế độ form
     */
    bindingData(data, formMode) {
        let me = this;
        console.log(data);
        me.form.find("[FieldName]").each(function(){
            let fieldName = $(this).attr("FieldName"),
                dataType = $(this).attr("DataType"),
                value = data[fieldName],
                control = $(this);

            me.setValueControl(control, value , dataType);
        });
        if (formMode == Resource.FormMode.Duplicate) {
            me.getNewId();
        }
    }

    /**
     * @description: format dữ liệu cho control
     * @param {*} control ô nhập dữ liệu
     * @param {*} value giá trị của ô nhập dữ liệu
     * @param {*} dataType kiểu dữ liệu
     */
    setValueControl(control, value , dataType){
        let me = this;

        switch(dataType){
            case Resource.DataTypeColumn.Date:
                value = CommonFn.formatDateReverse(value);
                break;
            case Resource.DataTypeColumn.Currency:
                value = CommonFn.formatMoney(value);
                break;
        }

        control.val(value);
    }

    /**
     * @description: lấy id nhân viên mới
     */
    getNewId() {
        let me = this;
        let url = 'http://localhost:59811/api/v1/Employees/new-code';
        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
          me.form.find("#employee-code").val(response);
        })
    }

    /**
     * @description: hành động đóng form
     */
    close(){
        let me = this;
       
        me.form.fadeOut(150);
        $(".overplay").fadeOut(150);
        me.Parent.removeSelectedRow();
    }

    /**
     * @description: hành động lưu dữ liệu
     */
    save() {
        let me = this,
            isValid = me.validateForm();

        if(isValid){
            let data = me.getFormData();

            // Lưu data
            me.saveData(data);
        }
    }

    /**
     * Xử lý validate form
     */
    validateForm(){
        let me = this,
            isValid = me.validateRequire();

            
        if(isValid){
            isValid = me.validateEmployeeCode();
        }
       
        

        // if(isValid){
        //     isValid = me.validateDuplicate();
        // }

        if(isValid){
            isValid = me.validateEmail();
        }

        if(isValid){
            isValid = me.validateDateTime();
        }

        // Todo

        // if(isValid){
        //     isValid = me.validateCustom();
        // }

        return isValid;
    }

    /**
     * Validate các trường băt buộc
     */
    validateRequire(){
        let me = this,
            isValid = true;

        me.form.find('[required]').each(function(){
            let value = $(this).val();
         
            if(!value){
                isValid = false;
               
                $(this).removeClass("validate-input").addClass("require-control");
                $(this).attr("title", "Không được bỏ trống");
            }else{
                $(this).removeClass("require-control").addClass("validate-input");
                $(this).attr("title", "");
            }
        });

        return isValid;
    }

    /**
     * kiểm tra mã nhân viên đã tồn tại chưa
     * @returns {boolean}
     */
    validateEmployeeCode(){
        let me = this,
            isValid = true;
        let currentEmployeeCode = me.form.find("#employee-code").val();
    
        let url = `http://localhost:59811/api/v1/Employees/${currentEmployeeCode}`;
        fetch(url)
            .then(response => {
                if (response.status == 200) {
                    isValid = false;
                    me.form.find("#employee-code").removeClass("validate-input").addClass("require-control");
                    me.form.find("#employee-code").attr("title", "Mã nhân viên đã tồn tại");
                } else {
                    me.form.find("#employee-code").removeClass("require-control").addClass("validate-input");
                    me.form.find("#employee-code").attr("title", "");
                }
            })
            
            .catch(error => console.log(error));

        return isValid;
    }

    /**
     * @description: kiểm tra email đã đúng định dạng chưa
     * @returns {boolean}
     */
    validateEmail(){
        let me = this;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        let email = me.form.find("#email").val();
   
        if(!emailReg.test(email)) {
            me.form.find("#email").removeClass("validate-input").addClass("require-control");
            me.form.find("#email").attr("title", "Email không hợp lệ");
            return false;
        } else {
            me.form.find("#email").removeClass("require-control").addClass("validate-input");
            me.form.find("#email").attr("title", "");
            return true;
        }
    }

    /**
     * @description: kiểm tra ngày tháng năm có đúng yêu cầu không lớn hơn ngày hiện tại
     * @returns {boolean}
     */
    validateDateTime(){
        let me = this,
            isValid = true;
        let currentDate = new Date();
        me.form.find("input[type=date]").each(function(){
            let value = $(this).val();
  
            if (value > currentDate.toISOString().split('T')[0]) {
                $(this).removeClass("validate-input").addClass("require-control");
                $(this).attr("title", "Ngày không hợp lệ");
                isValid =  false;
           
            } else {
                $(this).removeClass("require-control").addClass("validate-input");
                $(this).attr("title", "");
            }
        });
        return isValid;
    }

    /**
     * @description: Lấy dữ liệu form
     */
    getFormData(){
        let me = this,
            data = {};

        me.form.find("[FieldName]").each(function(){
            let dataType = $(this).attr("DataType") || "String",
                field = $(this).attr("FieldName"),
                value = null;
                

            switch(dataType){

                case Resource.DataTypeColumn.Currency:
                    value = $(this).val().replace(/\D/g,'');
                    break;
                case Resource.DataTypeColumn.String:
                    value = $(this).val();
                    break;
                case Resource.DataTypeColumn.Number:
                    value = $(this).val();
                    break;
                // Todo
                default: 
                value = $(this).val();
                break;
            }

            data[field] = value;
        });
        if (data.employeeID == '') {
            data.employeeID = '0ddb6560-76a3-4365-8663-58dd0f2c238f';
        }
        return data;
    }

    /**
     * @description: Lưu dữ liệu
     * @param {*} data data từ form
     */
    saveData(data){
        let me = this,
            method = Resource.Method.Post,
            url;
        console.log(data);
        // Xử lý lưu vào DB
        if(me.FormMode == Resource.FormMode.Edit){
            method = Resource.Method.Put;
            url = `http://localhost:59811/api/v1/Employees/${data.employeeID}`;
            console.log('put');
        } else {
            url = `http://localhost:59811/api/v1/Employees/`;
        }

        CommonFn.Ajax(url, method, data, function(response){
            if(response){
                me.close();
                me.Parent.refresh();
            }else{
                console.log("Có lỗi");
            }
        });
    }


    /**
     * @description: Reset nội dung form
     */
    resetForm(){
        let me = this;

        me.form.find("[FieldName]").each(function(){
            let dataType = $(this).attr("DataType") || "String";
            switch(dataType){
                case Resource.DataTypeColumn.Enum:
                    me.resetEnumControl(this)
                    break;
                case Resource.DataTypeColumn.String:
                case Resource.DataTypeColumn.Number:
                case Resource.DataTypeColumn.Currency:
                    $(this).val(null);
                    break;
                case Resource.DataTypeColumn.Date:
                    
                    $(this).val(new Date().toISOString().split('T')[0]);
                    break;
            }
        });
        me.form.find(".require-control").removeClass("require-control").addClass("validate-input");
    }

    /**
     * @description: Reset thanh select
     * @param {*} control thanh select
     */
    resetEnumControl(control){
        let me =this;
        let temp = $(control).find("option:first").val();
        $(control).val(temp);
    }

    resetNumber(control){

    }
}