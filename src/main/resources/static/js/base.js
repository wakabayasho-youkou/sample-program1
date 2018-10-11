var gl_scheduleData;
var $sc;

$(function () {
  // ===================================== tabulatorへの反映 start =====================================

  var scheduleList = $().getScheduleData();

  $.each(scheduleList, function (index, value) {
    value['no'] = index + 1;
    $("#testTable").tabulator("addRow", scheduleList[index]);
  });

  // ===================================== tabulatorへの反映  end  =====================================

  // ===================================== 時間コンボボックスの作成 start =====================================

  for(var i = 0; i < 24; i++){
    num = ("00" + i).slice(-2);
		$("#cut1StartHour").append($('<option>', { value: num, text: num}));
		$("#cut1EndHour").append($('<option>', { value: num, text: num}));
		$("#cut2StartHour").append($('<option>', { value: num, text: num}));
		$("#cut2EndHour").append($('<option>', { value: num, text: num}));
  }

		$("#cut1StartMinute").append($('<option>').val("00").text("00"));
		$("#cut1EndMinute").append($('<option>').val("00").text("00"));
		$("#cut2StartMinute").append($('<option>').val("00").text("00"));
		$("#cut2EndMinute").append($('<option>').val("00").text("00"));

		$("#cut1StartMinute").append($('<option>').val("30").text("30"));
		$("#cut1EndMinute").append($('<option>').val("30").text("30"));
		$("#cut2StartMinute").append($('<option>').val("30").text("30"));
		$("#cut2EndMinute").append($('<option>').val("30").text("30"));

  // ===================================== 時間コンボボックスの作成  end  =====================================

  // 入力ダイアログを定義
  $("#cutSchedule").dialog({
    title: "スケジュールの変更",
    autoOpen: false,
    modal: true,
    resizable: false,
    height: 320,
    width: 360,
    open: function (event, ui) {
      // 閉じるボタンを非表示
      $(".ui-dialog-titlebar-close").hide();
    },
    buttons: {
      "OK": function () {
        // 分割後のスケジュールを登録する
        // エラーチェック
        var cut1Start = $().time2second($("#cut1StartHour").val() + ":" + $("#cut1StartMinute").val());
        var cut1End = $().time2second($("#cut1EndHour").val() + ":" + $("#cut1EndMinute").val());
        var cut2Start = $().time2second($("#cut2StartHour").val() + ":" + $("#cut2StartMinute").val());
        var cut2End = $().time2second($("#cut2EndHour").val() + ":" + $("#cut2EndMinute").val());
        var error = false;
        $("#error1").empty();
        $("#error2").empty();
        if (cut1Start >= cut1End) {
          $("#error1").html("<p class='red'>開始・終了時間が不正です</p>");
          error = true;
        }
        if (cut2Start >= cut2End) {
          $("#error2").html("<p class='red'>開始・終了時間が不正です</p>");
          error = true;
        }
        if (error) return;
        // ダイアログのデータからスケジュールを変更する
        $().editSchedule();
        $(this).dialog("close");
      },
      "キャンセル": function () {
        $(this).dialog("close");
      }
    }
  });

  $(document).on('click', '#schedulePage', function () {
    $('<form/>', {action: '/index', method: 'post'})
      .appendTo(document.body)
      .submit();
  });

  $(document).on('click', '#dashboard', function () {
    $('<form/>', {action: '/dashboard', method: 'post'})
      .appendTo(document.body)
      .submit();
  });

  $(document).on('click', '#tablePage', function () {
    $('<form/>', {action: '/tablePage', method: 'post'})
      .appendTo(document.body)
      .submit();
  });

  $(document).on('click', '#testBtn', function () {

    // 通信実行
    $.ajax({
      type: "post",
      url: "/service",
      data: JSON.stringify($("#testTable").tabulator("getData")),
      contentType: 'application/json',
      dataType: "json",
    })
    .then(
      function (json_data) {
        // 成功時の処理
        console.log(json_data);
      },
      function(){
        // 失敗時の処理
        console.log("失敗しました");
      }
    )
    .then(
      function(){
        console.log("成功")
      }
    )
    .then(
      function(){
        console.log("2回目")
      }
    );
  });

  $(document).on('click', '#selectBtn', function () {

    // 通信実行
    $.ajax({
      type: "post",
      url: "/company",
      dataType: "json",
    })
    .then(
      function (json_data) {
        // 成功時の処理
        console.log(json_data);
      },
      function(){
        // 失敗時の処理
        console.log("失敗しました");
      }
    );
  });

  $(document).on('click', '#insBtn', function () {

    // 通信実行
    $.ajax({
      type: "post",
      url: "/insCompany",
      dataType: "json",
    })
    .then(
      function (json_data) {
        // 成功時の処理
        console.log(json_data);
      },
      function(){
        // 失敗時の処理
        console.log("失敗しました");
      }
    );
  });

  $(document).on('click', '#refreshScheduleBtn', function () {

    // 通信実行
    $.ajax({
      type: "post",
      url: "/refreshSchedule",
      dataType: "json",
    })
    .then(
      function (json_data) {
        // 成功時の処理
        console.log(json_data);
      },
      function(){
        // 失敗時の処理
        console.log("失敗しました");
      }
    );
  });

  $(document).on('click', '#helloBtn', function () {

    $('<form/>', {action: '/hello', method: 'post'})
      .append($('<input/>', {type: 'hidden', name: 'name', value: "名前です"}))
      .append($('<input/>', {type: 'hidden', name: 'aaa', value: "aです"}))
      .append($('<input/>', {type: 'hidden', name: 'bbb', value: "bです"}))
      .append($('<input/>', {type: 'hidden', name: 'ccc', value: "cです"}))
      .appendTo(document.body)
      .submit();
  });


	// スケジュールデータの取得
  $.ajax({
    type: "post",
    url: "/getSchedule",
    dataType: "json",
  })
  .then(
    function (json_data) {
      // 成功時の処理

		  $.each(json_data, function (index, value) {

				var tmpSchedule = {
					id : value.scheduleId,
					timeline : value.timeline,
					start : value.start,
					end : value.end,
					text : value.text,
				}

				console.log(tmpSchedule);

				$sc.addScheduleData(tmpSchedule);
				// 再描画
				$sc.resetBarPosition(tmpSchedule.timeline);
		  });
    },
    function(){
      // 失敗時の処理
      console.log("失敗しました");
    }
  );
});

// 「秒」を「時：分」に変換する処理(30分区切り)
$.fn.second2time = function (second) {
  var min = $().second2min(second);
  var hour = $().second2hour(second);
  return hour + ":" + min;
}

// 「秒」を「分」に変換する処理(30分区切り)
$.fn.second2min = function (second) {
  var min = Math.floor(second / 60) % 60;
  var min = Math.floor(min / 30) * 30;
  return ("00" + min).slice(-2);
}

// 「秒」を「時間」に変換する処理
$.fn.second2hour = function (second) {
  var hour = Math.floor(second / 3600);
  return ("00" + hour).slice(-2);
}

// 「時：分」を「秒」に変更する処理
$.fn.time2second = function (time) {
  var arrTime = time.split(':');
  var h = arrTime[0];
  var m = arrTime[1];
  return (Number(h) + (Number(m) / 60)) * 60 * 60;
};