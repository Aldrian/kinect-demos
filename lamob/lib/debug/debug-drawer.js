window.KinectGestures = window.KinectGestures ? window.KinectGestures : {};

(function(){

    function DebugDrawer()
    {
        let canvasEl = null,
            context = null;

        let record = false;

        function update(frame) {
            for (let iSkeleton = 0; iSkeleton < frame.skeletons.length; ++iSkeleton) {
                let skeleton = frame.skeletons[iSkeleton];
                if (skeleton.trackingState > 0){
                  updateSkeleton(skeleton, iSkeleton).then((sums) => {
                    let deltaz = sums.z / sums.length;
                    Ptypo.changeParam(Math.abs(parseFloat(35 * deltaz) + 1), 'thickness', 'antique-font');

                    let deltax = sums.x / sums.length;
                    Ptypo.changeParam(parseFloat((0.6 + deltax)), 'curviness', 'antique-font');

                    let deltahandsy = sums.yhands;
                    Ptypo.changeParam(((deltahandsy * 500) + 350), 'xHeight', 'antique-font');
                    let deltahandsx = sums.xhands;
                    Ptypo.changeParam((deltahandsx * 3), 'width', 'antique-font');
                    let deltahandzright = sums.zhandright;
                    Ptypo.changeParam(Math.abs((deltahandzright * 500) + 150), 'ascender', 'antique-font');
                    let deltahandzleft = sums.zhandleft;
                    Ptypo.changeParam(-Math.abs((deltahandzleft * 500) + 150), 'descender', 'antique-font');
                  });
                }
            }
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
