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
              let skeletonSumZ = 0;
              let numSkeleton = 0;
              let skeletonSumHandsX = 0; 
              let skeletonSumHandsY = 0;
              let skeletonSumHandsZRight = 0;
              let skeletonSumHandsZLeft = 0;
              Promise.all(skeletonPromises).then((results) => {
                results.map((sums) => {
                  skeletonSumZ += (sums.z / sums.length);
                  skeletonSumX += (sums.x / sums.length);
                  skeletonSumHandsX += sums.xhands;
                  skeletonSumHandsY += sums.yhands;
                  skeletonSumHandsZRight += sums.zhandright;
                  skeletonSumHandsZLeft += sums.zhandleft;
                  numSkeleton++;
                });
                let deltaz = (skeletonSumZ / numSkeleton);
                Ptypo.changeParam(Math.abs(parseFloat(35 * deltaz) + 1), 'thickness', 'antique-font');
                
                let deltax = (skeletonSumX / numSkeleton);
                Ptypo.changeParam(parseFloat((0.6 + deltax)), 'curviness', 'antique-font');
                
                let deltahandsy = (skeletonSumHandsY / numSkeleton);
                Ptypo.changeParam(((deltahandsy * 500) + 350), 'xHeight', 'antique-font');
                let deltahandsx = (skeletonSumHandsX / numSkeleton);
                Ptypo.changeParam((deltahandsx * 3), 'width', 'antique-font');
                let deltahandzright = (skeletonSumHandsZRight / numSkeleton);
                Ptypo.changeParam(Math.abs((deltahandzright * 500) + 150), 'ascender', 'antique-font');
                let deltahandzleft = (skeletonSumHandsZLeft / numSkeleton);
                Ptypo.changeParam(-Math.abs((deltahandzleft * 500) + 150), 'descender', 'antique-font');
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
            
            
            let yhands = Math.abs(skeleton.joints[7].position.y - skeleton.joints[11].position.y);
            let xhands = Math.abs(skeleton.joints[7].position.x - skeleton.joints[11].position.x);
            let zhandright = (skeleton.joints[11].position.z - skeleton.joints[3].position.z);
            let zhandleft = (skeleton.joints[7].position.z - skeleton.joints[3].position.z);

            resolve({
              x: sumx,
              z: sumz,
              xhands,
              yhands,
              zhandleft,
              zhandright,
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