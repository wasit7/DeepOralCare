const label = {
  comp_abbr_name_en: "ชื่อย่อบริษัท (EN)",
  name_en: "ชื่อบริษัท (EN)",
  source_pk: "PK ต้นทาง",
  organization_ref_id: "รหัสองค์กร",
  batch_date: "วันที่สร้างข้อมูล",
  last_upd_date: "วันที่ปรับปรุงข้อมูลในระบบ",
  upd_user_id: "รหัสพนักงานผู้ปรับปรุงข้อมูลในระบบ",
  source_app: "ชื่อแหล่งข้อมูล",
  dbd_no: "เลขนิติบุคคล/รหัสบริษัท",

  // Organize label data type
  id_address_type: "ประเภทที่อยู่",
  address_name_th: "เลขที่ ชื่ออาคาร/หมู่บ้าน (TH)",
  hist_desc: "สิ่งที่เปลี่ยนแปลง",
  address_name_en: "เลขที่ ชื่ออาคาร/หมู่บ้าน (EN)",
  org_name_th: "ชื่อบริษัท (TH)",
  id_unique_id_type: "รหัสประเภทบัตรอ้างอิงบุคคล",
  bus_ref_id: "bus_ref_id",
  exp_date: "วันที่่ลบข้อมูล (ข้อมูลหมดอายุ)",
  unique_id_no: "เลขที่บัตรอ้างอิงบุคคล",
  id_bus_type: "id_bus_type",
  website: "Website",
  id: "ID",
  org_abbr_name_en: "org_abbr_name_en",
  email: "Email",
  org_name_en: "ชื่อบริษัท (EN)",
  eff_date: "วันที่ได้รับข้อมูล (วันที่ call service)",
  telephone: "โทรศัพท์",
  country_id: "country_id",
  post_code: "รหัสไปรษณีย์",

  // Personal label
  person_ref_id: "61438",
  thai_national_id: "thai_national_id",
  person_surname_th: "นามสกุล (ภาษาไทย)",
  mobile_phone: "โทรศัพท์มือถือ",
  id_card_country: "id_card_country",
  person_name_th: "ชื่อบุคคล (ภาษาไทย)",
  person_surname_en: "นามสกุุล (ภาษาอังกฤษ)",
  person_name_en: "ชื่ื่อบุคคล (ภาษาอังกฤษ)",
};

const findMatchLabel = (key) => {
  // const lane
  if (label[key]) {
    return label[key];
  }
  return key;
};

export default findMatchLabel;
