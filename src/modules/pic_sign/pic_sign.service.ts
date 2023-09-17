import { Injectable } from "@nestjs/common";
import { CreateOssSign } from './dto/create-oss-sign.dto';
import * as dayjs from 'dayjs';
import * as OSS from 'ali-oss';
import { ACCESS_KEY, ACCESS_KEY_SECRET } from "src/common/constant/alicloud";

@Injectable()
export class PicSignService {
    constructor() { }

    async getSignature(): Promise<CreateOssSign> {
        const config = {
            accessKeyId:ACCESS_KEY,
            accessKeySecret:ACCESS_KEY_SECRET,
            bucket: 'yikina-pic-app',
            dir: '/images',
        }

        const client = new OSS(config)
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const policy = {
            expiration: date.toISOString(), // 请求有效期
            conditions: [
                ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
            ],
        };

        // bucket域名
        const host = `http://${config.bucket}.${(await client.getBucketLocation()).location
            }.aliyuncs.com`.toString();
        //签名
        const formData = await client.calculatePostSignature(policy);
        //返回参数
        const params = {
            expire: dayjs().add(1, 'days').unix().toString(),
            policy: formData.policy,
            signature: formData.Signature,
            accessId: formData.OSSAccessKeyId,
            host,
            dir: 'images/',
        };


        return params
    }

    async getAvatarSignature(): Promise<CreateOssSign> {
        const config = {
            accessKeyId:ACCESS_KEY,
            accessKeySecret:ACCESS_KEY_SECRET,
            bucket: 'yikina-pic-app',
            dir: '/avatars',
        }

        const client = new OSS(config)
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const policy = {
            expiration: date.toISOString(), // 请求有效期
            conditions: [
                ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
            ],
        };

        // bucket域名
        const host = `http://${config.bucket}.${(await client.getBucketLocation()).location
            }.aliyuncs.com`.toString();
        //签名
        const formData = await client.calculatePostSignature(policy);
        //返回参数
        const params = {
            expire: dayjs().add(1, 'days').unix().toString(),
            policy: formData.policy,
            signature: formData.Signature,
            accessId: formData.OSSAccessKeyId,
            host,
            dir: '/avatars',
        };


        return params

    }
}

