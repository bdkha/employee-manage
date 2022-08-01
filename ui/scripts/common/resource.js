var Resource = Resource || {};

// Các kiểu dữ liệu của column trong grid
Resource.DataTypeColumn = {
    Number: "Number",
    Date: "Date",
    Enum: "Enum",
    Currency: "Currency",
    String: "String"
};

// Các method khi gọi ajax
Resource.Method = {
    Get: "Get",
    Post: "Post",
    Put: "Put",
    Delete: "Delete"
}


// giới tính
Resource.Gender = {
    Female: "Nữ",
    Male: "Nam",
    Other: "Khác"
}

// Các commandType của toolbar
Resource.CommandType = {
    Add: "Add",
    Edit: "Edit",
    Delete: "Delete",
    Refresh: "Refresh",
    Import: "Import",
    Export: "Export",
    Duplicate: "Duplicate",
}

// Các action trên form detail
Resource.CommandForm = {
    Save: "Save",
    Cancel: "Cancel"
}

Resource.FormMode = {
    Add: "Add",
    Edit: "Edit",
    Duplicate: "Duplicate"
}

Resource.WorkStatus = {
    Working: "Đang làm việc",
    NotWorking: "Chưa làm việc",
    Leave: "Đã nghỉ việc",
    Resign: "Đang nghỉ phép"
}