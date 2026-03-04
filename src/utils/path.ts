/**
 * resolveAsset - 资源路径解析器
 * 
 * 📌 作用：将以 '/' 开头的本地资源路径（如 '/resume.pdf'）转换为
 *    相对于当前部署位置的正确路径。
 * 
 * 📌 为什么需要它：
 *    当网站部署在子目录（比如 example.com/Left2y/）时，
 *    写 '/resume.pdf' 浏览器会去找 example.com/resume.pdf（错误！）
 *    而实际文件在 example.com/Left2y/resume.pdf
 *    这个函数会自动帮你加上正确的前缀。
 * 
 * 📌 使用 `import.meta.env.BASE_URL`：
 *    这是 Vite 提供的一个特殊变量，它的值就是 vite.config.ts 中 `base` 的值。
 *    开发时是 './'，部署时也是 './'，这样资源路径就是相对的，到处都能用。
 */
export const resolveAsset = (path: string): string => {
    // 如果路径为空，直接返回空字符串
    if (!path) return '';

    // 如果已经是完整的网络地址（http/https），不需要处理，原样返回
    if (path.startsWith('http')) return path;

    // 拿到 Vite 的 base 路径（比如 './' 或 '/Left2y/'）
    const baseUrl = import.meta.env.BASE_URL || './';

    // 清理路径：把 '/resume.pdf' 变成 'resume.pdf'
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // 拼接：baseUrl + cleanPath => './resume.pdf'
    return `${baseUrl}${cleanPath}`;
};
