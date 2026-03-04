package model;

public class CustomerAccountInfo {


    String Indent_sheet_num;
    String SosSum;

    String Sales1;
    String CustomerName;

    public String getIndent_sheet_num() {
        return Indent_sheet_num;
    }

    public void setIndent_sheet_num(String indent_sheet_num) {
        Indent_sheet_num = indent_sheet_num;
    }

    public String getSosSum() {
        return SosSum;
    }

    public void setSosSum(String sosSum) {
        SosSum = sosSum;
    }

    public String getSales1() {
        return Sales1;
    }

    public void setSales1(String sales1) {
        Sales1 = sales1;
    }

    public String getCustomerName() {
        return CustomerName;
    }

    public void setCustomerName(String customerName) {
        CustomerName = customerName;
    }

    public CustomerAccountInfo(String Indent_sheet_num, String SosSum, String Sales1, String CustomerName){
        this.Indent_sheet_num = Indent_sheet_num;
        this.SosSum = SosSum;
        this.Sales1 = Sales1;
        this.CustomerName = CustomerName;

    }


    public  CustomerAccountInfo(){

    }


    @Override
    public String toString() {
        return "CustomerAccountInfo{" +
                "Indent_sheet_num='" + Indent_sheet_num + '\'' +
                ", SosSum='" + SosSum + '\'' +
                ", Sales1='" + Sales1 + '\'' +
                ", CustomerName='" + CustomerName + '\'' +
                '}';
    }

}
