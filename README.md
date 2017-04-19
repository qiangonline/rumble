# rumble
rumble.js是一个slider lib，基于jQuery，实现（无缝循环/水平/垂直）滑动效果，实现每个“滑块”内动画。
## 使用
```
<link href="animate/animate.css" rel="stylesheet" />
<link href="rumble/rumble.css" rel="stylesheet" />
...
<script src="jquery/jquery-2.1.3.js"></script>
<script src="rumble/rumble.js"></script>
<script>
    var r1 = new Rumble('#rumble', {
        //direction: 'vertical',
        loop: true
        //slidesPerView: 1
    });
</script>

```
```
<div class="rumble-wrapper">
    <div class="slide">
        <div class="animated" data-animation="rollIn" style="position:absolute; left: 0; top: 3rem; width:100%; text-align: center;color:#fff;">
            A
        </div>
    </div>
    <div class="slide">
        <div class="animated" data-animation-duration="1500" data-animation="flipInX" style="position: absolute; left: 0; top: 3.5rem; width:100%; text-align: center;">
            A
        </div>
        <div class="animated" data-animation-duration="3000" data-animation="flipInX" data-animation-delay="500" style="position: absolute; left: 0; top: 4.5rem; width:100%; text-align: center;">
            B
        </div>
    </div>
</div>
```
```bash
<div class="animated" data-animation="flipInX" data-animation-duration="1500" data-animation-delay="500"></div>
```
# demo
http://qiangonline.github.io/rumble/
