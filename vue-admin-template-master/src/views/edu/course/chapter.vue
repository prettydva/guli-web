<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button @click="openDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button style type="text" @click="openVideo(chapter.id)">添加小节</el-button>
            <el-button style type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.videos" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button style type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" :title="chapterTitle">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" :title="videoTitle">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      saveBtnDisabled: false,
      chapterVideoList: [],
      courseId: "",
      dialogChapterFormVisible: false, //章节弹框
      dialogVideoFormVisible: false, //小节弹框
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
      video: {
        title: "",
        sort: 0,
        free: 0,
        videoSourceId: "",
        videoOriginalName: "",
      },
      chapter: {
        //封装章节数据
        title: "",
        sort: 0,
      },
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapterVideo();
    }
  },
  methods: {
    //点击确认删除时调用
    handleVodRemove() {
      video.deleteAliyunVideo(this.video.videoSourceId).then((resp) => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        //把视频id和name清空
        this.video.videoSourceId = "";
        this.video.videoOriginalName = "";
        //把文件列表清空
        this.fileList = [];
      });
    },
    //点击x时调用
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除${file.name}?`);
    },
    //上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      //上传视频id赋值
      this.video.videoSourceId = response.data;
      //上传视频名称赋值
      this.video.videoOriginalName = file.name;
    },
    handleUploadExceed() {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
    //小节操作
    saveOrUpdateVideo() {
      if (this.video.id) {
        this.updateVideo();
      } else {
        this.addVideo();
      }
    },
    //添加小节
    addVideo() {
      video.addVideo(this.video).then((resp) => {
        //关闭弹框
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //修改小节弹窗
    openEditVideo(videoId) {
      this.videoTitle = "编辑课时";
      this.dialogVideoFormVisible = true;
      video.getVideoById(videoId).then((resp) => {
        this.video = resp.data;
      });
      console.log(this.fileList);
    },
    //修改小节
    updateVideo() {
      video.updateVideo(this.video.id, this.video).then((resp) => {
        //关闭弹框
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //删除小节
    removeVideo(videoId) {
      this.$confirm("此操作将删除小节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        video.deleteVideo(videoId).then((resp) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //刷新页面
          this.getChapterVideo();
        });
      });
    },
    //添加小节窗口
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true;
      this.videoTitle = "添加课时";
       //清空表单
      this.video = {};
      this.fileList = [];
      //设置章节id
      this.video.chapterId = chapterId;
      //设置课程id
      this.video.courseId = this.courseId;
    },
    //弹出添加章节窗口
    openDialog() {
      //弹框
      this.dialogChapterFormVisible = true;
      this.chapterTitle = "添加章节";
      //表单数据清空
      this.chapter.id = "";
      this.chapter.title = "";
      this.chapter.sort = 0;
    },
    //修改章节按钮
    openEditChatper(chapterId) {
      this.chapterTitle = "编辑章节";
      this.dialogChapterFormVisible = true;
      chapter.getChapterById(chapterId).then((resp) => {
        this.chapter = resp.data;
      });
    },
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    next() {
      //跳转到第三步
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
    //根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then((resp) => {
        // console.log(resp.data);
        this.chapterVideoList = resp.data;
      });
    },
    //删除章节
    removeChapter(id) {
      this.$confirm("此操作将删除章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        chapter.deleteChapter(id).then((resp) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //刷新页面
          this.getChapterVideo();
        });
      });
    },
    //添加或删除章节
    saveOrUpdate() {
      if (this.chapter.id) {
        this.updateChapter();
      } else {
        this.addChapter();
      }
    },
    //修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter.id, this.chapter).then((resp) => {
        // //关闭弹框
        this.dialogChapterFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "修改章节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //添加章节
    addChapter() {
      this.chapter.courseId = this.courseId;
      chapter.addChapter(this.chapter).then((resp) => {
        //关闭弹框
        this.dialogChapterFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "添加章节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
  },
};
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>