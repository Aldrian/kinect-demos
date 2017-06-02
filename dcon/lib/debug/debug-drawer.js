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
              let skeletonAngle = 0;
              Promise.all(skeletonPromises).then((results) => {
                results.map((sums) => {
                  skeletonSumZ += (sums.z / sums.length);
                  skeletonSumX += (sums.x / sums.length);
                  skeletonSumHandsX += sums.xhands;
                  skeletonSumHandsY += sums.yhands;
                  skeletonAngle += sums.angle;
                  numSkeleton++;
                });
                let proximity = (skeletonSumZ / numSkeleton);
                Ptypo.changeParam(75 * (4 - proximity), 'thickness', 'grotesk-font');
                $("#thickness .value").html((75 * (4 - proximity)).toFixed(2));
                
                let deltax = (skeletonSumX / numSkeleton);
                Ptypo.changeParam(Math.pow(deltax, 3) - 2, 'curviness', 'grotesk-font');
                $("#curviness .value").html(((deltax) * 4).toFixed(2));
                
                let deltahandsy = (skeletonSumHandsY / numSkeleton);
                Ptypo.changeParam(Math.abs( 0.8 + deltahandsy) * 400, 'capDelta', 'grotesk-font');
                $("#capDelta .value").html((Math.abs( 0.8 + deltahandsy) * 400).toFixed(2));
                
                let deltahandsx = (skeletonSumHandsX / numSkeleton);
                Ptypo.changeParam(deltahandsx * 1.8, 'width', 'grotesk-font');
                $("#width .value").html((deltahandsx * 1.8).toFixed(2));
                
                let deltaAngle = (skeletonAngle / numSkeleton);
                let radAngle = Math.atan(1.8 / deltaAngle);
                Ptypo.changeParam((90 - (radAngle * (180 / Math.PI)) * 3 ), 'slant', 'grotesk-font');
                $("#slant .value").html(((90 - (radAngle * (180 / Math.PI)) * 3 ).toFixed(2)));
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
            
            // Hands
            let yhands = (skeleton.joints[7].position.y + skeleton.joints[11].position.y) / 2;
            let xhands = Math.abs(skeleton.joints[7].position.x - skeleton.joints[11].position.x);
            
            //angle 
            let angle = (skeleton.joints[3].position.x - skeleton.joints[0].position.x);
            resolve({
              x: sumx,
              xhands,
              yhands,
              z: sumz,
              angle,
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