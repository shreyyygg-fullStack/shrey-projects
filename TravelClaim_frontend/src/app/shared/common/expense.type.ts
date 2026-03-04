export interface AllowanceData {
    selectedGrade: string;
    classAPlus: number | null;
    classA: number | null;
    classB: number | null;
    domesticFa: number | null;
    domesticDa: number | null;
    overseasFa: number | null;
    overseasDa: number | null;
  }

  export interface settingUpdateData{
    id:number;
    name:string;
    status:string;
  }