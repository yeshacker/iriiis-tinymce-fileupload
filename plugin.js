tinymce.PluginManager.add('fileupload', function(editor, url) {
  editor.addButton('fileupload', {
    content_style: 'div { height: 50px; line-height: 50px; margin: 0; font-size: 14px;}',
    title: 'Upload attachment',
    onclick: function() {
      var $body= $(document.body);
      var $el = $('<input class="tempFileInputElement" type="file"/>');
      var $fileInput = $body.append($el);
      $el.click();
      $el.on('change', function(e) {
        var file = e.target.files[0];

        // Upload Image
        var fd = new FormData();
        fd.append('upload', file);
        fd.append('name', file.name);
        fd.append('mimeType', 'file');
        fd.append('action', 'upload');
        fd.append('parentId', '0');

        var xhr = new XMLHttpRequest();
        var globalUserName = editor.getParam("globalUserName");
        var SP_IDS = editor.getParam("SP_IDS");
        var S_IDS = editor.getParam("S_IDS");
        xhr.open('POST', '/or/gw/c/files?account=' + globalUserName + '@iriiisdev.com' + '&spId=' + SP_IDS.IRIIISDOCUMENTS , true);

        xhr.upload.onprogress = updateProgress;
        xhr.onload = onLoad;
        xhr.onerror = onError;

        xhr.send(fd);

        var notification;
        function onError() {
          // top.tinymce.activeEditor.notificationManager.close();
          if(notification) notification.close();
          notification = editor.notificationManager.open({
            text: 'Error uploading image'
          });
        }

        function onLoad() {
          if (this.status == 200) {
            var resp = JSON.parse(this.response);
            if(resp.code === 4) {
              // top.tinymce.activeEditor.notificationManager.close();
              if(notification) notification.close();
              var img = editor.dom.create('img',
                {
                  'src': 'http://iriiisdev.com/or/gw/iriiisdocuments/files/'+resp.data._id+'/download?isDownload=false',
                  'width': editor.getParam('mediaWidth'),
                  'height': editor.getParam('mediaHeight')
                }
                );
                editor.selection.setNode(img);
              console.log(resp);
            } else if(resp.code === 1) {
              // top.tinymce.activeEditor.notificationManager.close();
              if(notification) notification.close();
              notification = editor.notificationManager.open({
                text: 'Error uploading image ' + resp.message
              });
            }
          };
        };

        function updateProgress(e) {
          if (e.lengthComputable) {
            var percentComplete = (e.loaded / e.total) * 100;
            if(!notification)
              notification = editor.notificationManager.open({
                text: 'uploading image...',
                progressBar: true
              });
            notification.progressBar.value(percentComplete);
          }
        };
        // $documents.files.post(fd, qp, header).then(function(response) {
        // });

        $('.tempFileInputElement').remove();
      });
    }
  });
});
