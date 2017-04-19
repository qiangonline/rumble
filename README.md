# rumble
rumble.js是一个slider lib，基于jQuery，实现（无缝循环/水平/垂直）滑动效果，实现每个“滑块”内动画。
## 使用
```
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
```bash
<div class="animated" data-animation="flipInX" data-animation-duration="1500" data-animation-delay="500"></div>
```
# demo
http://qiangonline.github.io/rumble/
