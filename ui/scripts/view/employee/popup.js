class PopUp {
    /**
     * @déscription: Hàm khởi tạo popup
     * @param {*} popupID id của popup
     */
    constructor(popupID) {
        let me = this;
        me.popup = $(`#${popupID}`);
        me.initEvents();
    }

    /**
     * @description: Hàm khởi tạo sự kiện cho popup
     */
    initEvents() {
        let me = this;
        me.popup.find(" [CommandType]").off("click");	
        me.popup.find(" [CommandType]").on("click", function(){
            let commandType = $(this).attr("CommandType");
            if(me[commandType] && typeof me[commandType] == "function"){
                me[commandType]();
            }
        });
    }

    /**
     * @description: Hàm đóng popup
     */
    close() {
        let me = this;
        me.popup.hide();
        $(".overplay").hide();
        $(".delete-text").empty();
    }

    /**
     * @description: Hàm xóa nhân viên
     */
    delete() {
        let me = this,
        data = me.Record,
        url = `http://localhost:59811/api/v1/Employees/${data.employeeID}`;
        
        CommonFn.Ajax(url, Resource.Method.Delete, null, function(data){
            if (data) {
            me.close();
            me.Parent.refresh();
            }
        }
        );
    }

    /**
     * @description: mở popup
     * @param {*} param param truyền từ parent
     */
    open(param) {
        let me = this;
        Object.assign(me, param);
        let text  = $(`<p>Bạn có chắc chắn muốn xóa nhân viên <strong>${me.Record.employeeName}</strong> không?</p>`);
        $(".delete-text").append(text);
        me.popup.show();

        $(".overplay").show();
        console.log(me.popup);
    }


}