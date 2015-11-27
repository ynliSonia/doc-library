
$(document).delegate('.J_del', 'click', function(ev) {


	ev.preventDefault();

	var $target = $(ev.target);

	var link = $target.attr('href');

	$.ajax({
		url: link,
		type: 'delete',
		data: {},
		dataType: 'json',
		success: function(res) {

			if(res.status == 1) {
				window.location.reload();

			} else {
				
				alert('删除失败，删除的任务不存在或已经被删除');
			}
			
		}
	});
});