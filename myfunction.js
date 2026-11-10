function validateName() {
  var name = $("#fullName").val();
  var pattern = /^[\u0621-\u064A]+( [\u0621-\u064A]+)*$/;
  if (name !== "" && !pattern.test(name)) {
    $("#errName").text("الاسم يجب أن يحتوي أحرفاً عربية فقط");
    return false;
  }
  $("#errName").text("");
  return true;
}

function validateNationalId() {
  var id = $("#nationalId").val();
  if (id === "") {
    $("#errNationalId").text("الرقم الوطني إلزامي");
    return false;
  }
  if (!/^[0-9]{11}$/.test(id)) {
    $("#errNationalId").text("يجب أن يتكون من 11 رقماً بالضبط");
    return false;
  }
  var province = parseInt(id.substring(0, 2), 10);
  if (province < 1 || province > 14) {
    $("#errNationalId").text("أول خانتين يجب أن تكونا بين 01 و 14");
    return false;
  }
  $("#errNationalId").text("");
  return true;
}

function parseDate(text) {
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(text)) {
    return null;
  }
  var parts = text.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);
  var d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return null;
  }
  return d;
}

function validateStartDate() {
  var text = $("#startDate").val();
  if (text === "") {
    $("#errStart").text("تاريخ البداية إلزامي");
    return false;
  }
  var start = parseDate(text);
  if (start === null) {
    $("#errStart").text("الرجاء اختيار تاريخ صحيح");
    return false;
  }
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    $("#errStart").text("تاريخ البداية لا يمكن أن يكون في الماضي");
    return false;
  }
  $("#errStart").text("");
  return true;
}

function validateEndDate() {
  var text = $("#endDate").val();
  if (text === "") {
    $("#errEnd").text("تاريخ النهاية إلزامي");
    return false;
  }
  var end = parseDate(text);
  if (end === null) {
    $("#errEnd").text("الرجاء اختيار تاريخ صحيح");
    return false;
  }
  var start = parseDate($("#startDate").val());
  if (start !== null && end <= start) {
    $("#errEnd").text("تاريخ النهاية يجب أن يكون لاحقاً لتاريخ البداية");
    return false;
  }
  $("#errEnd").text("");
  return true;
}

function validatePhone() {
  var phone = $("#phone").val();
  if (phone === "") {
    $("#errPhone").text("");
    return true;
  }
  if (!/^09(3|4|5|6|8|9)[0-9]{7}$/.test(phone)) {
    $("#errPhone").text("الرقم يجب أن يطابق شبكة Syriatel أو MTN (مثال: 0933123456)");
    return false;
  }
  $("#errPhone").text("");
  return true;
}

function validateEmail() {
  var email = $("#email").val();
  if (email === "") {
    $("#errEmail").text("");
    return true;
  }
  if (!/^[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(email)) {
    $("#errEmail").text("صيغة البريد الإلكتروني غير صحيحة (مثال: name@mail.com)");
    return false;
  }
  $("#errEmail").text("");
  return true;
}

function getDays() {
  var start = parseDate($("#startDate").val());
  var end = parseDate($("#endDate").val());
  var ms = end - start;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function showResult() {
  var days = getDays();
  var total = 0;
  var html = "<h3>نتيجة طلب الحجز</h3>";
  if ($("#fullName").val() !== "") {
    html += "<p>مقدم الطلب: " + $("#fullName").val() + "</p>";
  }
  html += "<table><tr><th>الرمز</th><th>الموديل</th><th>السعر اليومي</th><th>عدد الأيام</th><th>المجموع</th></tr>";

  $(".selectBox:checked").each(function () {
    var row = $(this).closest("tr");
    var code = row.find("td").eq(1).text();
    var model = row.find("td").eq(2).text();
    var price = parseInt(row.find("td").eq(4).text(), 10);
    var carTotal = price * days;
    total += carTotal;
    html += "<tr><td>" + code + "</td><td>" + model + "</td><td>" + price + "</td><td>" + days + "</td><td>" + carTotal + "</td></tr>";
  });

  html += "</table>";

  var discount = 0;
  if (days > 7) {
    discount = total * 0.1;
  }
  var finalAmount = total - discount;

  html += "<p>المجموع قبل الخصم: " + total + " ل.س</p>";
  html += "<p>الخصم: " + discount + " ل.س</p>";
  html += "<p>المبلغ النهائي: " + finalAmount + " ل.س</p>";

  $("#resultBox").html(html).slideDown();
}

function submitForm() {
  var ok = true;
  if (!validateName()) { ok = false; }
  if (!validateNationalId()) { ok = false; }
  if (!validateStartDate()) { ok = false; }
  if (!validateEndDate()) { ok = false; }
  if (!validatePhone()) { ok = false; }
  if (!validateEmail()) { ok = false; }
  if (ok) {
    showResult();
  } else {
    $("#resultBox").hide();
  }
}

$(document).ready(function () {

  var now = new Date();
  var y = now.getFullYear();
  var m = ("0" + (now.getMonth() + 1)).slice(-2);
  var d = ("0" + now.getDate()).slice(-2);
  $("#startDate").attr("min", y + "-" + m + "-" + d);
  $("#endDate").attr("min", y + "-" + m + "-" + d);

  $("#fullName").blur(validateName);
  $("#nationalId").blur(validateNationalId);
  $("#phone").blur(validatePhone);
  $("#email").blur(validateEmail);

  $("#startDate").change(function () {
    validateStartDate();
    if ($("#endDate").val() !== "") {
      validateEndDate();
    }
  });
  $("#endDate").change(validateEndDate);

  $("#continueBtn").click(function () {
    var count = $(".selectBox:checked").length;
    if (count === 0) {
      alert("الرجاء اختيار سيارة واحدة على الأقل");
      return;
    }
    $("#bookingSection").slideDown();
  });

  $(".detailsBox").click(function () {
    var detailsRow = $(this).closest("tr").next(".detailsRow");
    detailsRow.toggle();
    if (detailsRow.is(":visible")) {
      $(this).val("إخفاء");
    } else {
      $(this).val("إظهار");
    }
  });

  $("#submitBtn").click(submitForm);

  $("#exitLink").click(function (event) {
    event.preventDefault();
    if (confirm("هل تريد الخروج من الموقع؟")) {
      window.location.href = "home.html";
    }
  });

});