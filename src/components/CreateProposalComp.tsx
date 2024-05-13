import Layout from '@/components/layout';
import { Card } from '@/components/ui/card';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import {
  CHAIN_ID,
  createProposalMethod,
  getTerm,
  genProposalId,
  chainNameToChainId,
} from '@/eth/method';
import { useRouter } from 'next/navigation';
import { useNonce } from '@/hooks/useNonce';
import { ReloadIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import { getWeb3 } from '@/eth';
import { Input } from '@/components/ui/input';
import { processRpcErrorMsg, scala } from '@/utils';
import { useActionList } from '@/hooks/useActionList';
import Head from 'next/head';
import useAppStore from '@/store/appStore';
import { daoProposalDetail } from '@/api';
import { useTerm } from '@/hooks/useTerm';

const formSchema = z.object({
  fromChainID: z.string(),
  toChainID: z.string(),
  kindId: z.string(),
  actionId: z.string(),
  description: z.string(),
  nonce: z.string(),
});

const PREV_DATA_KEY = '_PREV_DATA_KEY';

function getPrevStorageData() {
  return JSON.parse(localStorage.getItem(PREV_DATA_KEY) || '{}');
}

function savePrevStorageData(key: string, v: any) {
  const data = getPrevStorageData();
  data[key] = v;
  localStorage.setItem(PREV_DATA_KEY, JSON.stringify(data));
}

function itemAndIndexToKey(item: any, index: number) {
  return `params_${item.name}${item.type.replace('[', '').replace(']', '')}${index}`;
}

export default function CreateProposalComp() {
  useEffect(() => {
    const res = localStorage.getItem(PREV_DATA_KEY);
    if (!res) {
      localStorage.setItem(PREV_DATA_KEY, JSON.stringify({}));
    }
  }, []);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromChainID: CHAIN_ID,
      toChainID: '',
      kindId: '',
      actionId: '',
      description: '',
      nonce: '',
    },
  });

  form.watch('toChainID');
  form.watch('kindId');

  const createProposalId = useAppStore((state) => state.createProposalId);

  const actionList = useActionList(form.getValues('kindId'));

  const getActionInputs = useCallback(
    function (actionId: string, toChainID: string) {
      const actionItem =
        actionList.find(
          (item: any) => item.functionName === actionId && item.chain === toChainID,
        ) || {};
      let actionInputs: any = [];
      if (actionItem.abiText) {
        try {
          const abi = JSON.parse(actionItem.abiText);
          actionInputs = abi.inputs || [];
        } catch (error) {
          console.log(error);
        }
      }
      return actionInputs;
    },
    [actionList],
  );

  useEffect(() => {
    if (!createProposalId || actionList.length === 0) {
      return;
    }
    daoProposalDetail(createProposalId).then((res) => {
      let kin = res.kindId + '';
      if (kin !== '0' && kin !== '1') {
        kin = '2';
      }
      form.setValue('kindId', kin);
      form.setValue('actionId', res.functionName || '');
      form.setValue('toChainID', res.targetChain || '');
      form.setValue('description', (res.remark || '').replace(/\d{13}$/, ''));

      const actionInputs = getActionInputs(res.functionName || '', res.targetChain || '');

      actionInputs.forEach((item: any, index: number) => {
        (form as any).setValue(itemAndIndexToKey(item, index), (res.params || [])[index]);
      });
    });
    useAppStore.getState().changeCreateProposalId('');
  }, [createProposalId, form, getActionInputs, actionList]);

  const nonce = useNonce(chainNameToChainId[form.getValues('toChainID')] || '');

  const term = useTerm();

  const actionSelectList = useMemo(() => {
    const ret = new Set();
    actionList.forEach((item) => {
      ret.add(item.functionName);
    });
    return Array.from(ret);
  }, [actionList]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const web3 = getWeb3();
      const postData = {
        ...values,
      };
      if (postData.kindId === '') {
        toast.error('请选择提案主类别');
        return;
      }
      if (postData.actionId === '') {
        toast.error('请选择提案功能');
        return;
      }
      if (postData.toChainID === '') {
        toast.error('请选择目标链');
        return;
      }
      if (postData.description.trim().length < 5) {
        toast.error('提案描述至少5个字符');
        return;
      }

      const actionId = form.getValues('actionId');
      const actionItem =
        actionList.find(
          (item: any) => item.functionName === actionId && item.chain === postData.toChainID,
        ) || {};
      let actionInputs: any = [];
      if (actionItem.abiText) {
        try {
          const abi = JSON.parse(actionItem.abiText);
          actionInputs = abi.inputs || [];
        } catch (error) {
          toast.error('abi解析出错');
          return;
        }
      } else {
        toast.error('未查询到abi');
        return;
      }
      const myContract = new web3.eth.Contract(
        JSON.parse(`[${actionItem.abiText}]` as any),
        '0x0000000000000000000000000000000000000000',
      );
      const params: any = [];
      const params2: any = [];
      const allValues: any = form.getValues();

      actionInputs.forEach((item: any, index: number) => {
        const newVal = allValues[itemAndIndexToKey(item, index)].trim();
        if (newVal.startsWith('[') && newVal.endsWith(']')) {
          try {
            params.push(eval(newVal));
            params2.push(eval(newVal));
            return;
          } catch (error) {
            params.push(newVal);
            params2.push(newVal);
            return;
          }
        } else {
          params2.push(newVal);
          if (item.decimals) {
            return params.push(scala(newVal, item.decimals));
          } else {
            return params.push(newVal);
          }
        }
      });
      const action = myContract.methods[actionItem.functionName](...params).encodeABI();

      if (loading) {
        return;
      }
      setLoading(true);

      const description = postData.description.trim() + Date.now();

      const term = await getTerm();

      const proposalId = await createProposalMethod({
        proposalId: '',
        abiId: actionItem.id,
        kindId: actionItem.kindId,
        nonce: nonce,
        functionName: actionItem.functionName,
        remark: description,
        params: params2,
        sourceChain: 'TOP',
        targetChain: postData.toChainID,
        voteTerm: term,
        action,
      });

      setLoading(false);
      if (proposalId) {
        savePrevStorageData(`_${actionItem.functionName}_${postData.toChainID}`, params2);
        toast.success('交易成功');
        if (window.innerWidth < 640) {
          router.push('/details?proposalId=' + proposalId);
        } else {
          useAppStore.getState().changeOpenCreate(false);
          useAppStore.getState().changeOpenDetails(proposalId);
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      toast.error(processRpcErrorMsg(error.message) || 'Error');
    }
  }

  useEffect(() => {
    useAppStore.getState().changeTitle('创建提案');
  }, []);

  return (
    <Card className="px-[20px] py-[26px] sm:border-none sm:shadow-none md:px-[77px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fromChainID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>源链：</FormLabel>
                <FormControl>
                  <div>TOP</div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kindId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-[#FE0706]">*</span>提案主类别：
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      if (v === '0') {
                        form.setValue('toChainID', '-1');
                      } else {
                        form.setValue('toChainID', '');
                      }
                      form.setValue('actionId', '');
                    }}
                    value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">治理型提案</SelectItem>
                      <SelectItem value="2">业务型提案</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-[#FE0706]">*</span>提案功能：
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue('toChainID', '');
                    }}
                    value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionSelectList.map((item: any) => {
                        return (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toChainID"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    <span className="text-[#FE0706]">*</span>目标链：
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v);
                        const res = getPrevStorageData();
                        const key = `_${form.getValues('actionId')}_${v}`;
                        if (res[key]) {
                          const actionInputs = getActionInputs(
                            form.getValues('actionId') || '',
                            v || '',
                          );

                          actionInputs.forEach((item: any, index: number) => {
                            let saveedValue = (res[key] || [])[index] || '';
                            if (typeof saveedValue === 'object' && Array.isArray(saveedValue)) {
                              saveedValue = `[${saveedValue.toString()}]`;
                            }
                            (form as any).setValue(itemAndIndexToKey(item, index), saveedValue);
                          });
                        }
                      }}
                      value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TOP" disabled={form.getValues('kindId') === '0'}>
                          TOP
                        </SelectItem>
                        <SelectItem value="ETH" disabled={form.getValues('kindId') === '0'}>
                          ETH
                        </SelectItem>
                        <SelectItem value="BSC" disabled={form.getValues('kindId') === '0'}>
                          BSC
                        </SelectItem>
                        <SelectItem value="ALL" disabled={form.getValues('kindId') === '2'}>
                          所有
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="nonce"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-[#FE0706]">*</span>序列号：
                </FormLabel>
                <FormControl>
                  <div className=" break-all">{nonce}</div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="nonce"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-[#FE0706]">*</span>选举轮次：
                </FormLabel>
                <FormControl>
                  <div className=" break-all">{term}</div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actionId"
            render={({ field }) => {
              const actionInputs = getActionInputs(
                form.getValues('actionId'),
                form.getValues('toChainID'),
              );
              return (
                <FormItem>
                  <FormLabel>
                    <span className="text-[#FE0706]">*</span>提案执行信息：
                  </FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <div className="text-sm px-3 py-2 rounded-md border border-input w-full">
                        {form.getValues('actionId') && (
                          <div className="mb-2">{form.getValues('actionId')}：</div>
                        )}

                        {actionInputs.length === 0 && '无需参数'}
                        {actionInputs.map((item: any, index: number) => {
                          return (
                            <div key={itemAndIndexToKey(item, index)} className="mb-2">
                              <label
                                htmlFor={itemAndIndexToKey(item, index)}
                                className="form-label mb-1 inline-block">
                                <span style={{ color: 'red' }}>*</span>
                                {item.name} ({item.desc})
                              </label>
                              <div className="input-group">
                                <Input
                                  type="text"
                                  className="form-control"
                                  id={itemAndIndexToKey(item, index)}
                                  {...(form as any).register(itemAndIndexToKey(item, index))}
                                  placeholder={item.desc}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-[#FE0706]">*</span>提案描述：
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="请输入至少五个字符" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex justify-center">
            <Button
              className="bg-[#EB5BCC] max-w-[300px] w-full mx-4"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (loading) {
                  return;
                }
                if (window.innerWidth < 640) {
                  router.back();
                } else {
                  useAppStore.getState().changeOpenCreate(false);
                }
              }}>
              取消
            </Button>
            <Button disabled={loading} type="submit" className="max-w-[300px] w-full mx-4">
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}提交
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
