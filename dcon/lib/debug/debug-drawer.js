window.KinectGestures = window.KinectGestures ? window.KinectGestures : {};

(function(){

    function DebugDrawer()
    {   
        let canvasEl = null,
            context = null;

        let record = false;        

        function update(frame)
        {   
            
            
            let skeletonPromises = [];
            for (let iSkeleton = 0; iSkeleton < frame.skeletons.length; ++iSkeleton) {
                let skeleton = frame.skeletons[iSkeleton];
                if (skeleton.trackingState > 0){
                    skeletonPromises.push(updateSkeleton(skeleton, iSkeleton));
                }                
            }
            if (skeletonPromises.length > 0) {
              let skeletonSumX = 0;
              let skeletonSumY = 0;
              let skeletonSumZ = 0;
              let numSkeleton = 0;
              Promise.all(skeletonPromises).then((results) => {
                results.map((sums) => {
                  skeletonSumZ += (sums.z / sums.length);
                  skeletonSumX += (sums.x / sums.length);
                  skeletonSumY += (sums.y / 6);
                  numSkeleton++;
                });
                let proximity = (skeletonSumZ / numSkeleton);
                Ptypo.changeParam(((4 - proximity) * 80), 'thickness', 'antique-font');
                if (proximity < 1.2 && !$('#glyph span').hasClass('stroboscopic')) {
                  $('#glyph span').css({
                    'color' : '',
                  });
                  $('#glyph').addClass('stroboscopic');
                }
                else {
                  $('#glyph').removeClass('stroboscopic');
                  $('#glyph span').css({
                    'color' : '#FFFF' + parseInt((4 - proximity) * 80).toString(16),
                    //'font-size' : parseInt(40 + ((4 - proximity) * 6)).toString() + 'px',
                    //'line-height' : (1.4 - (3 - proximity)/5).toString(),
                  });
                }
                
                let deltax = (skeletonSumX / numSkeleton);
                Ptypo.changeParam(parseFloat((1 + deltax)), 'curviness', 'antique-font');
                
                let deltay = (skeletonSumY / numSkeleton);
                Ptypo.changeParam(((deltay + 1) * 5), 'width', 'antique-font');
              });
            };
        }
        function updateSkeleton(skeleton, index)
        { 
          return new Promise((resolve, reject) => {
            // Z axis
              
            let sumz = 0;
            for (let iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
                let joint = skeleton.joints[iJoint];
                sumz = sumz + joint.position.z;
            }
              
            // X axis 
            let sumx = 0;
            for (let iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
                let joint = skeleton.joints[iJoint];
                sumx = sumx + joint.position.x;
            }
            
            // Y axis
            let sumy = 0;
            for (let iJoint = 5; iJoint < 12; ++iJoint) {
                if (iJoint !== 8) {
                  let joint = skeleton.joints[iJoint];
                  sumy = sumy + joint.position.y;
                }
            }
            resolve({
              x: sumx,
              y: sumy,
              z: sumz,
              length: skeleton.joints.length
            });
          });
        }

        return {
            update:update
        };
    }

    KinectGestures.DebugDrawer = DebugDrawer();

})(window);