---
title: An introduction to Deeplearning
description: 简单介绍有关深度学习理论的知识内容
pubDatetime: 2026-09-27T18:30:00+08:00   # 必须带时区
tags: ["学习笔记", "深度学习", "deeplearning"]
featured: false      # true 会置顶
draft: false         # true 则不参与构建
---

# 深度学习

> 定位：以多层神经网络为函数逼近器，端到端学习层次化表示。
> 主线：表示学习 → 架构归纳偏置（CNN/RNN/Transformer/GNN）→ 优化与正则 →
> 预训练与规模化 → 多模态与生成 → 大模型系统。
> 关联：理论基础见 ml 笔记，决策与对齐见 rl 笔记。

---

## 一、基础

### 神经元与网络

- 感知机 → 多层感知机（MLP）/ 全连接网络（FC）。
- 前向传播：`a⁽ˡ⁾ = f(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾)`。
- **激活函数**：Sigmoid、Tanh、ReLU、Leaky ReLU、ELU、GELU、SiLU/Swish、Mish、GLU/SwiGLU。
  - 非线性来源；缓解梯度消失；死神经元问题。
- **万能逼近定理**：足够宽的单隐层网络可逼近任意连续函数（但不保证可学、可泛化）。
- **反向传播**：链式法则 + 计算图；**自动微分**（前向/反向模式，AD）。
- 参数初始化：零初始化陷阱、Xavier/Glorot、He、正交初始化、LSUV；与激活配套。
- 损失函数：MSE、交叉熵、NLL、对比损失、三元组、Focal、Dice、CTC。

### 优化

- 一阶方法：**SGD**、Mini-batch、Momentum、Nesterov。
- 自适应：**AdaGrad、RMSProp、Adam、AdamW（解耦权重衰减）、LAMB、Adafactor**。
- 二阶/近似：牛顿法、L-BFGS、K-FAC、Shampoo。
- **学习率调度**：step、cosine、warmup、one-cycle、ReduceLROnPlateau。
- 关键技巧：批大小与学习率缩放（linear/square-root scaling）、梯度裁剪、梯度累积、混合精度（AMP）、损失缩放。
- 训练难点：病态曲率、鞍点、悬崖、梯度消失/爆炸、批归一化对优化的平滑作用。
- **损失景观**：平坦极小值与泛化、锐度感知最小化（SAM）、模式连通性。

### 正则化与泛化

- L1/L2、权重衰减、Dropout / DropPath / Spatial Dropout。
- **归一化**：BatchNorm、LayerNorm、InstanceNorm、GroupNorm、**RMSNorm**、WeightNorm。
- 数据增强：几何/颜色、Cutout、**Mixup、CutMix、AugMix**、RandAugment、AutoAugment。
- 早停、标签平滑、多任务辅助损失、EMA 权重、Stochastic Depth、DropBlock。
- 泛化理论：隐式正则、双下降、过参数化的良性过拟合、压缩界。

---

## 二、卷积神经网络（CNN）

- 卷积运算：局部连接、权值共享、平移等变性；输出尺寸/参数量计算。
- 池化：Max/Avg/Global、Stride 卷积替代。
- **感受野**、空洞卷积（Dilated/Atrous）、转置卷积、可变形卷积。
- 经典架构：
  - LeNet、AlexNet、VGG（深而规整）、GoogLeNet/Inception（多尺度 + 1×1 降维）。
  - **ResNet**（残差连接，解决退化）、DenseNet、ResNeXt。
  - 轻量：MobileNet（深度可分离卷积）、ShuffleNet、EfficientNet（复合缩放）。
  - 现代化：ConvNeXt、RegNet、RepVGG。
- 视觉注意力：SE、CBAM、Non-local、Vision Transformer（ViT）、Swin、ConvNeXt。
- 任务：分类、检测（R-CNN 系列、YOLO、DETR）、分割（FCN、U-Net、Mask R-CNN、SAM）、关键点、超分。

---

## 三、序列与注意力

### 循环网络

- RNN、BPTT、梯度消失/爆炸、梯度裁剪。
- **LSTM**（输入/遗忘/输出门、细胞状态）、**GRU**；双向 RNN、深层/残差 RNN。
- seq2seq、编码器-解码器、teacher forcing、beam search。

### 注意力机制

- 加性/点积注意力、缩放点积、对齐分数。
- **自注意力（Self-Attention）**：`Attention(Q,K,V)=softmax(QKᵀ/√d)V`。
- **多头注意力（MHA）**：子空间并行、拼接投影。
- 交叉注意力、掩码注意力、相对/绝对位置。

### Transformer

- 架构：编码器（自注意力 + FFN + 残差 + LayerNorm）、解码器（掩码自注意力 + 交叉注意力）。
- **位置编码**：正弦、可学习、相对位置、**RoPE**、ALiBi、NoPE。
- 变体：BERT（双向、MLM、NSP）、GPT（自回归）、T5（编码-解码、span 去噪）、XLNet、RoBERTa、DeBERTa、ELECTRA。
- 效率优化：稀疏注意力（Longformer、BigBird）、线性注意力、Performer、**FlashAttention**、GQA/MQA、滑动窗口。
- **规模化定律（Scaling Laws）**：Kaplan / Chinchilla，参数-数据-算力最优配比。

---

## 四、表示学习

- 词/句表示：Word2Vec（CBOW/Skip-gram + 负采样）、GloVe、FastText、ELMo、句向量（SBERT）。
- **自监督预训练**：
  - 对比学习：**SimCLR、MoCo、BYOL、SimSiam、SwAV**、InfoNCE、温度系数。
  - 掩码建模：BERT、**MAE**、BEiT、data2vec。
  - 冗余消除：Barlow Twins、VICReg。
- **多模态**：**CLIP**（图文对比）、ALIGN、BLIP/BLIP-2、Flamingo、LLaVA、ImageBind、SigLIP。
- **图神经网络**：GCN、GraphSAGE、GAT、GIN、消息传递框架、过平滑、异质图、图预训练。

---

## 五、生成模型

- **自编码器**：AE、去噪 AE、稀疏 AE、收缩 AE；**VAE**（重参数化、ELBO、KL 正则、后验坍塌）。
- **GAN**：生成器/判别器博弈、minimax、模式坍塌、WGAN/WGAN-GP、StyleGAN、CycleGAN、条件 GAN、扩散-GAN 混合。
- **流模型**：Normalizing Flows、RealNVP、Glow、耦合层、可逆网络。
- **扩散模型**：DDPM（前向加噪 / 反向去噪）、DDIM 加速采样、Score-based SDE、Classifier-Free Guidance、Latent Diffusion / Stable Diffusion、**DiT**。
- 自回归生成：PixelCNN、WaveNet、GPT 系列、VQ-VAE + 先验。
- 能量模型（EBM）、对比散度；流匹配（Flow Matching）、Rectified Flow。
- 评估：IS、FID、KID、Precision/Recall、CLIPScore、人工评估。

---

## 六、大语言模型（LLM）与前沿

### 预训练与架构

- Decoder-only 主流；**MoE（混合专家）**稀疏激活（Switch、GShard、Mixtral、DeepSeek-MoE）。
- 长上下文：位置外推（RoPE 插值/NTK/YaRN）、注意力近似、KV Cache 压缩。
- 训练目标：CLM、MLM、去噪、前缀语言建模、多 token 预测。

### 对齐与微调

- 指令微调（SFT）、**RLHF**（奖励模型 + PPO）、**DPO** 及变体（IPO、KTO、ORPO、SimPO）。
- 推理强化：**RLVR**、GRPO、过程奖励模型（PRM）、可验证奖励、测试时计算（CoT、self-consistency、搜索）。
- 参数高效微调（**PEFT**）：LoRA/QLoRA、Adapter、Prefix/Prompt Tuning、IA³。
- 提示工程、上下文学习（ICL）、思维链（CoT）、ReAct、工具调用。

### 智能体与多模态大模型

- **AI Agent**：规划、记忆、工具使用、Reflexion、多智能体协作（AutoGen、CAMEL）。
- 多模态 LLM：视觉-语言模型、原生多模态、语音、视频理解与生成（Sora）。
- RAG（检索增强生成）、向量数据库、长文档理解。
- 世界模型、具身智能（VLA）、机器人基础模型。

### 训练与推理工程

- 并行：数据并行（DP/DDP）、**ZeRO**、**FSDP**、张量并行、流水线并行、序列并行、专家并行。
- 显存优化：激活重计算（gradient checkpointing）、混合精度、Offload。
- 高效注意力与算子：FlashAttention、PagedAttention/vLLM、连续批处理。
- 推理加速：**量化**（INT8/INT4、GPTQ、AWQ、GGUF、SmoothQuant）、**知识蒸馏**、**剪枝**、推测解码（Speculative Decoding）、KV Cache。
- 分布式训练框架：Megatron-LM、DeepSpeed、PyTorch FSDP、Colossal-AI。

### 前沿架构与方向

- **状态空间模型**：S4、**Mamba / Mamba-2**、RWKV、RetNet、线性注意力复兴。
- 视觉新范式：ViT、**DiT**、**NeRF**、3D Gaussian Splatting、视频生成。
- 可解释与安全：机制可解释性（Superposition、SAE、Circuit）、对齐税、越狱与防御、红队。
- 高效学习：模型合并（Model Merging）、持续学习、灾难性遗忘缓解。
- 神经符号、检索增强、记忆增强、测试时训练（TTT）。

---

## 七、实践要点

- 数据处理：归一化、增广、采样器、类别不平衡、数据质量与去重。
- 训练稳定性：梯度监控、损失尖刺、NaN 排查、种子与可复现。
- 实验管理：配置管理、超参搜索、日志（TensorBoard/W&B）、模型版本。
- 部署：ONNX、TensorRT、TorchScript、量化服务、批处理与延迟权衡。
- 评估：任务指标 + 鲁棒性（对抗、分布偏移）+ 校准 + 公平性 + 效率。
